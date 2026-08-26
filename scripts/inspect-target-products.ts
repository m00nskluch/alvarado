import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
const envConfig = fs.readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};
envConfig.split('\n').forEach((line) => {
  const [k, v] = line.split('=');
  if (k && v) envVars[k.trim()] = v.trim();
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const serviceRoleKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, serviceRoleKey);

const targetNames = [
  'Aluminio C40 L Tapa Plástica',
  'Alusa para Alimento 300 mts House con Caja',
  'Alusa para Alimento 500 mts House',
  'Bandeja Térmica JL1',
  'Bolsa Camiseta 40x50 cm Grande',
  'Bolsa Celofán 10x25 cm',
  'Bolsa Celofán 25x30 cm',
  'Bolsa Celofán 20x30 cm',
  'Bolsa Papel Crack 0,25 Kilo',
  'Bolsa Papel Crack 0,50 Kilo',
  'Bolsa Papel Crack 7 Kilos',
  'Brochetas de Bambú 15 cm',
  'Brochetas de Madera Vara 15 cm',
  'Brochetas de Madera Vara 20 cm',
  'Brochetas de Madera Vara 30 cm',
  'Caja Chica Mondadientes de Bambú',
  'Cinta Masking Tape Grande',
  'Cinta Masking Tape Grande Paquete',
  'Completero (25)',
  'Completero (50)',
  'Cucharita de Madera 11 cm',
  'Liga Paquete Grande (500 grs)',
  'Manga Completa Confort (4 unidades)',
  'Manga Completa Confort (6 unidades)',
  'Manga Completa Elite 50 mts',
  'Manga Completa',
  'Manga Completa Suan (4 unidades)',
  'Manga Toalla Nova ELITE',
  'Manga Toalla Nova Elite',
  'Pañuelo descartables Suaves',
  'Pañuelos Descartables',
  'Papel Aluminio 100 mts',
  'Papel Aluminio para Alimento 40 mts',
  'Papel Confort Rendiplus (Paquete 4u)',
  'Papel Confort Rendiplus (Paquete 6u)',
  'Papel de Aluminio para Alimento 7,5 mts',
  'Papel Higienico Premium 200 mts SUAN',
  'Papel Mantequilla (Paquete 10u)',
  'Papel Mantequilla 5 m',
  'Plato Cartón 22 cm',
  'Rollo Grande',
  'Toalla Humeda Suave Max',
  'Toalla Nova de Papel Ultra 70 mts SUAN',
  'Vaso 6 oz Color Crack',
];

async function inspect() {
  const { data: categories } = await supabase.from('categories').select('*');
  const catMap = new Map(categories?.map((c: any) => [c.id, c.slug]));

  const { data: products } = await supabase.from('products').select('*');
  
  console.log(`Found ${products?.length} total products in database.`);

  const found = products?.filter((p: any) => 
    targetNames.some(t => p.name.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(p.name.toLowerCase()))
  );

  console.log('\n--- MATCHING PRODUCTS IN DB ---');
  found?.forEach((p: any) => {
    console.log(`[${p.id}] [${catMap.get(p.category_id)}] "${p.name}" -> ${p.image_url}`);
  });
}

inspect();
