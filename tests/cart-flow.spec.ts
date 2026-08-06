import { test, expect } from '@playwright/test';

test.describe('Flujo de Pedido en Distribuidora Alvarado ("Dónde Álvaro")', () => {
  test('Debe agregar un producto al carrito y mostrar el resumen del pedido', async ({ page }) => {
    // 1. Navegar a la página de plásticos
    await page.goto('/plasticos');
    await page.waitForLoadState('networkidle');

    // 2. Verificar que se muestra el título de la categoría
    await expect(page.locator('h1')).toContainText('Insumos & Contenedores Plásticos');

    // 3. Hacer clic en "+ Añadir al Pedido" en el primer producto
    const addButton = page.locator('button:has-text("+ Añadir al Pedido")').first();
    await addButton.click();

    // 4. Verificar que el panel del carrito se abre con "Mi Pedido"
    await expect(page.locator('text=Mi Pedido')).toBeVisible();

    // 5. Verificar que el total estimado y el botón de envío a WhatsApp están presentes
    await expect(page.locator('text=Total Estimado')).toBeVisible();
    await expect(page.locator('button:has-text("Enviar Pedido a WhatsApp")')).toBeVisible();
  });

  test('Navegación secundaria inter-páginas funciona correctamente', async ({ page }) => {
    await page.goto('/');
    
    // Navegar a Frutas y Verduras a través del CategoryNav
    await page.click('text=🍎 Frutas y Verduras');
    await expect(page).toHaveURL('/frutas-y-verduras');
    await expect(page.locator('h1')).toContainText('Frutas & Verduras Seleccionadas');

    // Navegar a Limpieza
    await page.click('text=🧹 Limpieza');
    await expect(page).toHaveURL('/limpieza');
    await expect(page.locator('h1')).toContainText('Productos de Limpieza e Higiene');
  });
});
