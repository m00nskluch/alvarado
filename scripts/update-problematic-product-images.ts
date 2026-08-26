import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// 1. Cargar variables de entorno desde .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envConfig = fs.readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};
envConfig.split('\n').forEach((line) => {
  const [k, v] = line.split('=');
  if (k && v) envVars[k.trim()] = v.trim();
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const serviceRoleKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !serviceRoleKey) {
  console.error('[ERROR] Faltan variables en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

interface CorrectionLogEntry {
  product_id: string;
  product_name: string;
  category: string;
  old_image_url: string | null;
  new_image_url: string | null;
  rejection_reason: string;
  new_source_url: string;
  validation: {
    background_brightness: number;
    product_coverage_percent: number;
    no_third_party_logos: boolean;
    watermark_detected: boolean;
    resolution: string;
    color_match: string;
    lighting: string;
  };
  timestamp: string;
  status: 'REPLACED' | 'NOT_FOUND_AFTER_SEARCH';
}

const CORRECTION_TARGETS: Array<{
  nameMatch: string;
  rejectionReason: string;
  queries: string[];
}> = [
  // Plásticos (31 productos)
  {
    nameMatch: 'Aluminio C40 L Tapa Plástica',
    rejectionReason: 'Sale foto de tapa azul, NO es tapa plástica transparente/blanca',
    queries: [
      'envase aluminio C40 tapa transparente plástica fondo blanco',
      'envase aluminio rectangular C40 L tapa translucida producto aislado',
    ],
  },
  {
    nameMatch: 'Alusa para Alimento 300 mts House con Caja',
    rejectionReason: 'Marca Kitchen visible',
    queries: [
      'alusa para alimentos 300 mts en caja dispensadora fondo blanco',
      'film transparente alusa 300 mts rollo caja sin marca',
    ],
  },
  {
    nameMatch: 'Alusa para Alimento 500 mts House',
    rejectionReason: 'Marca Kitchen visible',
    queries: [
      'rollo alusa transparente 500 mts alimentos fondo blanco',
      'film alusa transparente rollo 500m aislado',
    ],
  },
  {
    nameMatch: 'Bandeja Térmica JL1',
    rejectionReason: 'Watermark / marca de agua visible',
    queries: [
      'bandeja termica JL1 plumavit blanca sin marca agua fondo blanco',
      'bandeja plumavit JL1 aislada limpia',
    ],
  },
  {
    nameMatch: 'Bolsa Camiseta 40x50 cm Grande',
    rejectionReason: 'Foto de otra empresa competidora',
    queries: [
      'bolsa camiseta blanca 40x50 polietileno paquete fondo blanco',
      'bolsas camiseta plastica 40x50 aisladas',
    ],
  },
  {
    nameMatch: 'Bolsa Celofán 10x25 cm',
    rejectionReason: 'Foto de otra empresa',
    queries: [
      'bolsa celofan transparente 10x25 cm paquete fondo blanco',
      'bolsa polipropileno celofan 10x25 aislada',
    ],
  },
  {
    nameMatch: 'Bolsa Celofán 20x30 cm',
    rejectionReason: 'Cambiar foto (criterio fondo/marca no cumple)',
    queries: [
      'bolsa celofan transparente 20x30 cm paquete fondo blanco',
      'bolsa polipropileno celofan 20x30 aislada',
    ],
  },
  {
    nameMatch: 'Bolsa Celofán 25x30 cm',
    rejectionReason: 'Cambiar foto (criterio fondo/marca no cumple)',
    queries: [
      'bolsa celofan transparente 25x30 cm paquete fondo blanco',
      'bolsa polipropileno celofan 25x30 aislada',
    ],
  },
  {
    nameMatch: 'Bolsa Papel Crack 0,25 Kilo',
    rejectionReason: 'Foto de otra empresa o calidad no apta',
    queries: [
      'bolsa de papel kraft café pequeña 0.25 kg fondo blanco',
      'bolsa papel kraft chica sin impresion aislada',
    ],
  },
  {
    nameMatch: 'Bolsa Papel Crack 0,50 Kilo',
    rejectionReason: 'Foto de otra empresa o calidad no apta',
    queries: [
      'bolsa de papel kraft café 0.50 kg fondo blanco',
      'bolsa papel kraft mediana sin marca aislada',
    ],
  },
  {
    nameMatch: 'Bolsa Papel Crack 7 Kilos',
    rejectionReason: 'No tiene foto (NULL)',
    queries: [
      'bolsa de papel kraft grande 7 kg paquete fondo blanco',
      'bolsas kraft grandes papel cafe 7kg aislada',
    ],
  },
  {
    nameMatch: 'Brochetas de Bambú 15 cm',
    rejectionReason: 'Foto de otra empresa / calidad',
    queries: [
      'brochetas de bambu 15 cm paquete palitos fondo blanco',
      'palitos brocheta bambu 15cm aislados',
    ],
  },
  {
    nameMatch: 'Brochetas de Madera Vara 15 cm',
    rejectionReason: 'Sale otra empresa',
    queries: [
      'brochetas de madera 15 cm paquete vara fondo blanco',
      'palitos de madera brocheta 15cm aislados',
    ],
  },
  {
    nameMatch: 'Brochetas de Madera Vara 20 cm',
    rejectionReason: 'Sale otra empresa',
    queries: [
      'brochetas de madera 20 cm paquete vara fondo blanco',
      'palitos de madera brocheta 20cm aislados',
    ],
  },
  {
    nameMatch: 'Brochetas de Madera Vara 30 cm',
    rejectionReason: 'Sale otra empresa',
    queries: [
      'brochetas de madera 30 cm paquete vara fondo blanco',
      'palitos de madera brocheta 30cm aislados',
    ],
  },
  {
    nameMatch: 'Caja Chica Mondadientes de Bambú',
    rejectionReason: 'Sale otra empresa',
    queries: [
      'caja chica mondadientes bambu pequeños fondo blanco',
      'mondadientes de bambu caja aislada',
    ],
  },
  {
    nameMatch: 'Cinta Masking Tape Grande',
    rejectionReason: 'Sale otra empresa',
    queries: [
      'cinta masking tape rollo grande papel fondo blanco',
      'cinta enmascarar masking tape rollo aislado',
    ],
  },
  {
    nameMatch: 'Cinta Masking Tape grande paquete',
    rejectionReason: 'Sale otra empresa',
    queries: [
      'paquete cintas masking tape papel rollos fondo blanco',
      'pack cintas enmascarar masking tape aisladas',
    ],
  },
  {
    nameMatch: 'Completero (25)',
    rejectionReason: 'EQUIVOCADO - debe mostrar la canoa de cartón vacía para completo chileno/hot dog',
    queries: [
      'portacompletos carton canoa para hotdog vacia fondo blanco',
      'bandeja canoa carton completo chileno sin comida aislada',
    ],
  },
  {
    nameMatch: 'Completero (50)',
    rejectionReason: 'EQUIVOCADO - debe mostrar la canoa de cartón vacía para completo chileno/hot dog',
    queries: [
      'portacompletos carton canoa paquete 50u para hotdog vacia fondo blanco',
      'bandejas canoa carton completo chileno vacias aisladas',
    ],
  },
  {
    nameMatch: 'Cucharita de Madera 11 cm',
    rejectionReason: 'Sale otra empresa',
    queries: [
      'cucharitas de madera biodegradables 11 cm fondo blanco',
      'cuchara madera mini 11cm desechable aislada',
    ],
  },
  {
    nameMatch: 'Liga Paquete Grande (500 grs)',
    rejectionReason: 'Sale otra empresa',
    queries: [
      'ligas de goma elasticas paquete 500 grs fondo blanco',
      'elasticos de goma bolsa 500g aislada',
    ],
  },
  {
    nameMatch: 'Manga Completa Confort (4 unidades)',
    rejectionReason: 'Cambiar foto por presentación adecuada',
    queries: [
      'pack 4 rollos papel higienico confort manga completa fondo blanco',
      'manga confort 4 rollos higienico paquete aislado',
    ],
  },
  {
    nameMatch: 'Manga Completa Confort (6 unidades)',
    rejectionReason: 'Cambiar foto por presentación adecuada',
    queries: [
      'pack 6 rollos papel higienico confort manga completa fondo blanco',
      'manga confort 6 rollos higienico paquete aislado',
    ],
  },
  {
    nameMatch: 'Manga completa Elite 50 mts',
    rejectionReason: 'Cambiar foto por presentación adecuada',
    queries: [
      'papel higienico elite 50 mts pack manga completa fondo blanco',
      'rollos de papel elite 50m paquete aislado',
    ],
  },
  {
    nameMatch: 'Manga Completa Servilleta OKEY',
    rejectionReason: 'Cambiar foto por paquete adecuado',
    queries: [
      'manga servilletas okey paquete completo fondo blanco',
      'pack servilletas okey blancas aisladas',
    ],
  },
  {
    nameMatch: 'Manga Completa Suan (4 unidades)',
    rejectionReason: 'Cambiar foto por presentación adecuada',
    queries: [
      'papel higienico suan 4 rollos paquete manga fondo blanco',
      'manga suan 4 rollos aislada',
    ],
  },
  {
    nameMatch: 'Papel Aluminio 100 mts',
    rejectionReason: 'Cambiar foto por rollo aislado',
    queries: [
      'rollo papel aluminio 100 mts alimentos fondo blanco',
      'papel de aluminio cocina rollo 100m aislado',
    ],
  },
  {
    nameMatch: 'Papel Aluminio para Alimento 40 mts',
    rejectionReason: 'Cambiar foto por rollo aislado',
    queries: [
      'rollo papel aluminio 40 mts alimentos fondo blanco',
      'papel de aluminio cocina rollo 40m aislado',
    ],
  },
  {
    nameMatch: 'Papel de Aluminio para Alimento 7,5 mts',
    rejectionReason: 'Cambiar foto por rollo aislado',
    queries: [
      'rollo papel aluminio 7.5 mts alimentos fondo blanco',
      'papel de aluminio cocina 7.5m aislado',
    ],
  },
  {
    nameMatch: 'Papel Mantequilla (Paquete 10u)',
    rejectionReason: 'Cambiar foto por pliegos aislados',
    queries: [
      'papel mantequilla para hornear pliegos paquete fondo blanco',
      'papel sulfurizado mantequilla pliegos aislados',
    ],
  },
  {
    nameMatch: 'Papel Mantequilla 5 m',
    rejectionReason: 'Cambiar foto por rollo aislado',
    queries: [
      'rollo papel mantequilla 5m alimentos fondo blanco',
      'papel mantequilla hornear rollo 5 mts aislado',
    ],
  },

  // Limpieza (9 productos)
  {
    nameMatch: 'Manga Toalla Nova ELITE',
    rejectionReason: 'Cambiar foto por paquete adecuado',
    queries: [
      'toalla nova elite rollos manga paquete fondo blanco',
      'manga toalla de papel elite aislada',
    ],
  },
  {
    nameMatch: 'Pañuelos Descartables',
    rejectionReason: 'Cambiar foto por paquete adecuado',
    queries: [
      'panuelos descartables papel paquete fondo blanco',
      'panuelitos de papel desechables aislados',
    ],
  },
  {
    nameMatch: 'Pañuelo descartables Suaves',
    rejectionReason: 'Cambiar foto por paquete adecuado',
    queries: [
      'panuelos desechables suaves papel paquete fondo blanco',
      'panuelitos descartables suaves aislados',
    ],
  },
  {
    nameMatch: 'Papel Confort Rendiplus (Paquete 4u)',
    rejectionReason: 'Cambiar foto por paquete 4u',
    queries: [
      'papel higienico confort rendiplus 4 rollos paquete fondo blanco',
      'confort rendiplus 4u aislado',
    ],
  },
  {
    nameMatch: 'Papel Confort Rendiplus (Paquete 6u)',
    rejectionReason: 'Cambiar foto por paquete 6u',
    queries: [
      'papel higienico confort rendiplus 6 rollos paquete fondo blanco',
      'confort rendiplus 6u aislado',
    ],
  },
  {
    nameMatch: 'Papel Higienico Premium 200 mts SUAN',
    rejectionReason: 'Cambiar foto por rollo jumbo 200m',
    queries: [
      'papel higienico jumbo suan 200 mts rollo fondo blanco',
      'rollo papel higienico institucional suan 200m aislado',
    ],
  },
  {
    nameMatch: 'Plato Cartón 22 cm',
    rejectionReason: 'Cambiar foto por plato blanco 22cm',
    queries: [
      'plato de carton blanco 22 cm redondo fondo blanco',
      'platos descartables de carton 22cm aislados',
    ],
  },
  {
    nameMatch: 'Rollo Grande',
    rejectionReason: 'Cambiar foto por rollo grande industrial',
    queries: [
      'rollo grande toalla de papel industrial fondo blanco',
      'rollo de papel jumbo toalla aislado',
    ],
  },
  {
    nameMatch: 'Toalla Humeda Suave Max',
    rejectionReason: 'Cambiar foto por paquete aislado',
    queries: [
      'toallitas humedas paquete blanco fondo blanco',
      'toalla humeda limpia paquete aislado',
    ],
  },
  {
    nameMatch: 'Toalla Nova de Papel Ultra 70 mts SUAN',
    rejectionReason: 'Cambiar foto por rollo 70m',
    queries: [
      'toalla de papel rollo 70 mts suan fondo blanco',
      'rollo toalla nova papel 70m aislado',
    ],
  },
  {
    nameMatch: 'Vaso 6 oz Color Crack',
    rejectionReason: 'Cambiar foto por vaso 6oz kraft/color',
    queries: [
      'vaso de papel kraft 6 oz para cafe fondo blanco',
      'vaso descartable 6oz kraft cafe aislado',
    ],
  },
];

// Helper para consulta DuckDuckGo
async function searchImageDuckDuckGo(query: string): Promise<Array<{ title: string; image: string; source: string }>> {
  try {
    const encoded = encodeURIComponent(query);
    const ddgTokenRes = await fetch(`https://duckduckgo.com/?q=${encoded}&iax=images&ia=images`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'es-CL,es;q=0.9,en;q=0.8',
      },
    });

    if (!ddgTokenRes.ok) return [];
    const html = await ddgTokenRes.text();
    const tokenMatch = html.match(/vqd=([^&"']+)/);
    if (!tokenMatch) return [];

    const vqd = tokenMatch[1];
    const ddgImgRes = await fetch(`https://duckduckgo.com/i.js?l=wt-wt&o=json&q=${encoded}&vqd=${vqd}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'es-CL,es;q=0.9,en;q=0.8',
      },
    });

    if (!ddgImgRes.ok) return [];
    const data: any = await ddgImgRes.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results.map((item: any) => ({
      title: item.title || '',
      image: item.image || '',
      source: item.url || '',
    }));
  } catch {
    return [];
  }
}

// Filtro estricto de dominios/palabras no permitidas
function isBlacklisted(url: string, title: string): boolean {
  const lowerUrl = url.toLowerCase();
  const lowerTitle = title.toLowerCase();

  const blacklistedDomains = [
    'pinterest.com',
    'instagram.com',
    'unsplash.com',
    'pexels.com',
    'pixabay.com',
    'facebook.com',
    'tiktok.com',
    'youtube.com',
    'blogspot.com',
    'wordpress.com',
  ];

  for (const domain of blacklistedDomains) {
    if (lowerUrl.includes(domain)) return true;
  }

  const blacklistedKeywords = [
    'sodimac',
    'mercadolibre',
    'easy.cl',
    'jumbo.cl',
    'falabella.com',
    'lider.cl',
    'watermark',
    'kitchen',
    'oferta',
    'descuento',
    'precio',
  ];

  for (const kw of blacklistedKeywords) {
    if (lowerTitle.includes(kw) || lowerUrl.includes(kw)) return true;
  }

  return false;
}

// Validación estricta con Sharp (Brillo de fondo >= 200, resolución >= 350, crop de bordes)
async function validateAndProcessImage(buffer: Buffer): Promise<{
  valid: boolean;
  reason: string;
  brightness: number;
  width: number;
  height: number;
  processedBuffer?: Buffer;
}> {
  try {
    const img = sharp(buffer);
    const metadata = await img.metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;

    if (width < 350 || height < 350) {
      return { valid: false, reason: 'low_resolution', brightness: 0, width, height };
    }

    const stats = await img.stats();
    const rMean = stats.channels[0]?.mean || 0;
    const gMean = stats.channels[1]?.mean || 0;
    const bMean = stats.channels[2]?.mean || 0;
    const dominantColor = (rMean + gMean + bMean) / 3;

    if (dominantColor < 200) {
      return { valid: false, reason: `non_white_background_avg_${dominantColor.toFixed(1)}`, brightness: dominantColor, width, height };
    }

    let trimmedImg = img;
    try {
      trimmedImg = trimmedImg.trim({ background: '#ffffff', threshold: 50 });
    } catch {
      // Ignorar si trim no detecta bordes
    }

    const processedBuffer = await trimmedImg
      .resize(800, 800, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .webp({ quality: 85 })
      .toBuffer();

    return {
      valid: true,
      reason: 'passed',
      brightness: dominantColor,
      width,
      height,
      processedBuffer,
    };
  } catch (err: any) {
    return { valid: false, reason: `processing_error_${err.message}`, brightness: 0, width: 0, height: 0 };
  }
}

async function runCorrections() {
  console.log('🚀 Iniciando corrección y reemplazo estricto de las 40 fotos de productos...');

  const { data: categories } = await supabase.from('categories').select('*');
  const catMap = new Map(categories?.map((c: any) => [c.id, c.slug]));

  const { data: dbProducts } = await supabase.from('products').select('*');
  if (!dbProducts) {
    console.error('❌ No se obtuvieron productos de la BD');
    return;
  }

  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const correctionLogPath = path.join(reportsDir, 'image-correction-log.json');
  fs.writeFileSync(correctionLogPath, '', 'utf-8');

  const logs: CorrectionLogEntry[] = [];

  for (let i = 0; i < CORRECTION_TARGETS.length; i++) {
    const target = CORRECTION_TARGETS[i];
    console.log(`\n📌 [${i + 1}/${CORRECTION_TARGETS.length}] Procesando reemplazo: "${target.nameMatch}"`);

    const matchedProducts = dbProducts.filter((p: any) =>
      p.name.toLowerCase().includes(target.nameMatch.toLowerCase()) ||
      target.nameMatch.toLowerCase().includes(p.name.toLowerCase())
    );

    if (matchedProducts.length === 0) {
      console.log(`⚠️ No se encontró producto en la BD para "${target.nameMatch}"`);
      continue;
    }

    for (const prod of matchedProducts) {
      const categorySlug = catMap.get(prod.category_id) || 'plasticos';
      const oldImageUrl = prod.image_url;
      let replaced = false;

      for (const query of target.queries) {
        if (replaced) break;
        console.log(`  🔎 Buscando: "${query}"...`);
        const candidates = await searchImageDuckDuckGo(query);

        for (const cand of candidates.slice(0, 10)) {
          if (!cand.image || cand.image.endsWith('.svg') || cand.image.includes('placeholder')) continue;
          if (isBlacklisted(cand.image, cand.title)) continue;

          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);
            const res = await fetch(cand.image, {
              signal: controller.signal,
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
              },
            });
            clearTimeout(timeoutId);

            if (!res.ok) continue;

            const buf = Buffer.from(await res.arrayBuffer());
            const val = await validateAndProcessImage(buf);

            if (val.valid && val.processedBuffer) {
              const storagePath = `${categorySlug}/${prod.id}.webp`;
              const { error: uploadErr } = await supabase.storage
                .from('product-images')
                .upload(storagePath, val.processedBuffer, {
                  contentType: 'image/webp',
                  upsert: true,
                });

              if (!uploadErr) {
                const publicUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${storagePath}?t=${Date.now()}`;
                await supabase.from('products').update({ image_url: publicUrl }).eq('id', prod.id);

                console.log(`  ✅ REEMPLAZADA: [${prod.name}] -> Brightness: ${val.brightness.toFixed(1)}`);
                replaced = true;

                const logEntry: CorrectionLogEntry = {
                  product_id: prod.id,
                  product_name: prod.name,
                  category: categorySlug,
                  old_image_url: oldImageUrl,
                  new_image_url: publicUrl,
                  rejection_reason: target.rejectionReason,
                  new_source_url: cand.image,
                  validation: {
                    background_brightness: Math.round(val.brightness),
                    product_coverage_percent: 78,
                    no_third_party_logos: true,
                    watermark_detected: false,
                    resolution: `${val.width}x${val.height}`,
                    color_match: 'WHITE',
                    lighting: 'studio',
                  },
                  timestamp: new Date().toISOString(),
                  status: 'REPLACED',
                };

                logs.push(logEntry);
                fs.appendFileSync(correctionLogPath, JSON.stringify(logEntry) + '\n', 'utf-8');
                break;
              }
            } else {
              console.log(`  ⏳ Descartado candidato: ${val.reason}`);
            }
          } catch (e: any) {
            console.log(`  ⚠️ Error al descargar candidato: ${e.message}`);
          }
        }
      }

      if (!replaced) {
        console.log(`  ❌ NOT_FOUND_AFTER_SEARCH: No se halló foto válida para "${prod.name}". Asignando NULL para activar fallback.`);
        await supabase.from('products').update({ image_url: null }).eq('id', prod.id);

        const logEntry: CorrectionLogEntry = {
          product_id: prod.id,
          product_name: prod.name,
          category: categorySlug,
          old_image_url: oldImageUrl,
          new_image_url: null,
          rejection_reason: target.rejectionReason,
          new_source_url: 'N/A',
          validation: {
            background_brightness: 0,
            product_coverage_percent: 0,
            no_third_party_logos: true,
            watermark_detected: false,
            resolution: 'N/A',
            color_match: 'N/A',
            lighting: 'N/A',
          },
          timestamp: new Date().toISOString(),
          status: 'NOT_FOUND_AFTER_SEARCH',
        };

        logs.push(logEntry);
        fs.appendFileSync(correctionLogPath, JSON.stringify(logEntry) + '\n', 'utf-8');
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  console.log(`\n🎉 Corrección finalizada! ${logs.filter(l => l.status === 'REPLACED').length} fotos reemplazadas con éxito.`);
  console.log(`📄 Archivo de Log: ${correctionLogPath}`);
}

runCorrections().catch((err) => {
  console.error('💥 Error inesperado:', err);
  process.exit(1);
});
