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
  console.error('[ERROR] Faltan variables NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

interface ProductRecord {
  id: string;
  category_id: string;
  name: string;
  price: number;
  stock_quantity: string;
  image_url: string | null;
  is_available: boolean;
}

interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
}

interface SourcingResult {
  id: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  status: 'EXACT' | 'APPROXIMATE' | 'NOT_FOUND';
  sourceUrl: string;
  publicUrl: string | null;
}

// Helper para consultar DuckDuckGo Image Search
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
  } catch (err) {
    return [];
  }
}

// Normalizador para evaluar la coincidencia del nombre del producto
function isExactMatch(productName: string, candidateTitle: string, candidateUrl: string): boolean {
  const normProduct = productName.toLowerCase().replace(/[^a-z0-9]/g, ' ');
  const normCandidate = (candidateTitle + ' ' + candidateUrl).toLowerCase().replace(/[^a-z0-9]/g, ' ');

  const words = normProduct.split(/\s+/).filter((w) => w.length > 2);
  if (words.length === 0) return false;

  let matches = 0;
  for (const word of words) {
    if (normCandidate.includes(word)) {
      matches++;
    }
  }

  const ratio = matches / words.length;
  return ratio >= 0.5; // Si coincide el 50% o más de palabras clave
}

async function downloadAndUploadImage(
  productId: string,
  categorySlug: string,
  imageUrl: string
): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const imgRes = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    });
    clearTimeout(timeoutId);

    if (!imgRes.ok) return null;

    const arrayBuffer = await imgRes.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Procesamiento con sharp
    const processedBuffer = await sharp(inputBuffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const storagePath = `${categorySlug}/${productId}.webp`;

    const { error: uploadErr } = await supabase.storage
      .from('product-images')
      .upload(storagePath, processedBuffer, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (uploadErr) return null;

    return `${supabaseUrl}/storage/v1/object/public/product-images/${storagePath}`;
  } catch (err) {
    return null;
  }
}

async function processProduct(
  product: ProductRecord,
  categorySlug: string,
  categoryName: string
): Promise<SourcingResult> {
  console.log(`\n🔍 Buscando foto para [${product.id}] "${product.name}" (${categoryName})...`);

  // Búsqueda 1: Consulta primaria con nombre exacto
  const query1 = `${product.name} envases desechables chile mayorista`;
  const candidates1 = await searchImageDuckDuckGo(query1);

  // Intentar candidatos EXACT
  for (const cand of candidates1.slice(0, 10)) {
    if (!cand.image || cand.image.endsWith('.svg') || cand.image.includes('placeholder')) continue;

    if (isExactMatch(product.name, cand.title, cand.image)) {
      const publicUrl = await downloadAndUploadImage(product.id, categorySlug, cand.image);
      if (publicUrl) {
        await supabase.from('products').update({ image_url: publicUrl }).eq('id', product.id);
        console.log(`✅ [EXACT] "${product.name}" -> ${publicUrl}`);
        return {
          id: product.id,
          name: product.name,
          categorySlug,
          categoryName,
          status: 'EXACT',
          sourceUrl: cand.image,
          publicUrl,
        };
      }
    }
  }

  // Búsqueda 2: Consulta secundaria descriptiva
  const descriptiveName = product.name
    .replace(/\b[A-Z0-9]{2,}\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (descriptiveName.length > 3) {
    const query2 = `${descriptiveName} ${categoryName} distribuidora chile`;
    const candidates2 = await searchImageDuckDuckGo(query2);

    for (const cand of candidates2.slice(0, 8)) {
      if (!cand.image || cand.image.endsWith('.svg') || cand.image.includes('placeholder')) continue;

      const publicUrl = await downloadAndUploadImage(product.id, categorySlug, cand.image);
      if (publicUrl) {
        await supabase.from('products').update({ image_url: publicUrl }).eq('id', product.id);
        console.log(`🟡 [APPROXIMATE] "${product.name}" -> ${publicUrl}`);
        return {
          id: product.id,
          name: product.name,
          categorySlug,
          categoryName,
          status: 'APPROXIMATE',
          sourceUrl: cand.image,
          publicUrl,
        };
      }
    }
  }

  console.log(`❌ NOT_FOUND para "${product.name}"`);
  return {
    id: product.id,
    name: product.name,
    categorySlug,
    categoryName,
    status: 'NOT_FOUND',
    sourceUrl: 'N/A',
    publicUrl: null,
  };
}

async function main() {
  console.log('🚀 Iniciando script de sourcing y carga de imágenes de productos...');

  // 1. Asegurar bucket 'product-images'
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some((b) => b.name === 'product-images')) {
    console.log('📦 Creando bucket "product-images" con acceso público...');
    await supabase.storage.createBucket('product-images', { public: true });
  }

  // 2. Traer categorías
  const { data: categoriesData, error: catErr } = await supabase.from('categories').select('*');
  if (catErr || !categoriesData) {
    console.error('❌ Error al obtener categorías:', catErr);
    process.exit(1);
  }

  const categoryMap = new Map<string, CategoryRecord>();
  categoriesData.forEach((cat: CategoryRecord) => categoryMap.set(cat.id, cat));

  // 3. Traer todos los productos
  const { data: productsData, error: prodErr } = await supabase
    .from('products')
    .select('*')
    .order('category_id', { ascending: true })
    .order('name', { ascending: true });

  if (prodErr || !productsData) {
    console.error('❌ Error al obtener productos:', prodErr);
    process.exit(1);
  }

  console.log(`📊 Total de productos en la base de datos: ${productsData.length}`);

  const results: SourcingResult[] = [];

  for (let i = 0; i < productsData.length; i++) {
    const prod: ProductRecord = productsData[i];
    const cat = categoryMap.get(prod.category_id) || { name: 'Desconocido', slug: 'varios', id: '' };

    // Idempotencia: Si ya tiene image_url en Supabase Storage, registrar y omitir
    if (prod.image_url && prod.image_url.includes('supabase.co/storage')) {
      console.log(`⏭️ [${i + 1}/${productsData.length}] Ya procesado: "${prod.name}"`);
      results.push({
        id: prod.id,
        name: prod.name,
        categorySlug: cat.slug,
        categoryName: cat.name,
        status: 'EXACT',
        sourceUrl: 'Previamente procesado',
        publicUrl: prod.image_url,
      });
      continue;
    }

    console.log(`📌 [${i + 1}/${productsData.length}] Procesando: "${prod.name}"`);
    const result = await processProduct(prod, cat.slug, cat.name);
    results.push(result);

    // Breve pausa para evitar rate limit
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  // 4. Generar Reporte Final reports/image-sourcing-report.md
  console.log('\n📝 Generando reporte final en reports/image-sourcing-report.md...');

  const total = results.length;
  const exactCount = results.filter((r) => r.status === 'EXACT').length;
  const approxCount = results.filter((r) => r.status === 'APPROXIMATE').length;
  const notFoundCount = results.filter((r) => r.status === 'NOT_FOUND').length;

  const exactPct = ((exactCount / total) * 100).toFixed(1);
  const approxPct = ((approxCount / total) * 100).toFixed(1);
  const notFoundPct = ((notFoundCount / total) * 100).toFixed(1);

  let reportContent = `# Reporte Final de Sourcing y Carga de Imágenes de Productos

**Distribuidora Alvarado ("Dónde Álvaro")**  
Fecha de Ejecución: ${new Date().toISOString().split('T')[0]}  
Total de Productos Procesados: **${total}**

---

## 📊 Resumen Ejecutivo

| Estado | Descripción | Cantidad | Porcentaje |
| :--- | :--- | :---: | :---: |
| **EXACT** | Coincidencia exacta de producto, marca o formato | **${exactCount}** | **${exactPct}%** |
| **APPROXIMATE** | Coincidencia de tipo de producto y material | **${approxCount}** | **${approxPct}%** |
| **NOT_FOUND** | Sin coincidencia confiable (requiere revisión) | **${notFoundCount}** | **${notFoundPct}%** |

---

## 📋 Detalle Completo de Productos

| ID | Nombre | Categoría | Estado | URL Origen / Supabase Storage |
| :--- | :--- | :--- | :---: | :--- |
`;

  results.forEach((r) => {
    const displayUrl = r.publicUrl ? `[Storage](${r.publicUrl})` : r.sourceUrl;
    reportContent += `| \`${r.id}\` | ${r.name} | ${r.categoryName} | \`${r.status}\` | ${displayUrl} |\n`;
  });

  reportContent += `
---

## ⚠️ Productos APPROXIMATE (Para Revisión)

`;

  const approxItems = results.filter((r) => r.status === 'APPROXIMATE');
  if (approxItems.length === 0) {
    reportContent += `*No hay productos en categoría APPROXIMATE.*\n`;
  } else {
    approxItems.forEach((r) => {
      reportContent += `- **${r.name}** (\`${r.id}\`) - [Ver Imagen Asignada](${r.publicUrl})\n`;
    });
  }

  reportContent += `
---

## ❌ Productos NOT_FOUND (Sin Imagen Asignada)

`;

  const notFoundItems = results.filter((r) => r.status === 'NOT_FOUND');
  if (notFoundItems.length === 0) {
    reportContent += `*Todos los productos cuentan con imagen asignada.*\n`;
  } else {
    notFoundItems.forEach((r) => {
      reportContent += `- **${r.name}** (\`${r.id}\`) - Categoría: ${r.categoryName}\n`;
    });
  }

  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const reportPath = path.join(reportsDir, 'image-sourcing-report.md');
  fs.writeFileSync(reportPath, reportContent, 'utf-8');

  console.log(`🎉 Reporte guardado con éxito en: ${reportPath}`);
}

main().catch((err) => {
  console.error('💥 Error en la ejecución principal:', err);
  process.exit(1);
});
