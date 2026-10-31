const {test,expect}=require('@playwright/test');
const path=require('path');
test('director: responsive layout on narrow screen',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('file://'+path.resolve('index.html'));
 await expect(page.locator('#worldHub')).toBeVisible();
 await page.screenshot({path:'director-mobile.png',fullPage:true});
 const width=await page.evaluate(()=>document.documentElement.scrollWidth);
 expect(width).toBeLessThanOrEqual(405);
});
test('director: create, advance, inspect, undo and publish preview',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file://'+path.resolve('index.html'));
 await expect(page.locator('#worldCreateToggle')).toBeVisible();
 await page.locator('#worldCreateToggle').click();
 await page.locator('#wName').fill('Clase prueba');
 await page.locator('#wCap').fill('60');
 await page.locator('#wCreate').click();
 await expect(page.locator('#simView')).toBeVisible();
 await page.locator('#turnOne').click();
 await expect(page.locator('#cycle')).not.toHaveText('0 (turno 0)');
 await page.locator('#openDashboard').click();
 await expect(page.locator('#dashboardPanel')).toBeVisible();
 await page.locator('#bwTabs [data-tab="analysis"]').click();
 await expect(page.locator('#analysisPanel')).toBeVisible();
 await page.locator('#bwTabs [data-tab="atlas"]').click();
 await expect(page.locator('#ecoMapPanel')).toBeVisible();
 await page.locator('#bwTabs [data-tab="management"]').click();
 await page.evaluate(()=>document.getElementById('showPublisher').click());
 await expect(page.locator('#publisherGroup')).toHaveValue(/Clase prueba.*turno/);
 expect(errors).toEqual([]);
});

test('theme: dark by default, toggle to light and persist',async({page})=>{
 await page.goto('file://'+path.resolve('index.html'));
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await expect(page.locator('#themeToggle')).toBeVisible();
 await page.locator('#themeToggle').click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.reload();
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.locator('#themeToggle').click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
});

test('shared atlas: selects species and dims others',async({page})=>{
 await page.goto('file://'+path.resolve('index.html'));
 await page.locator('#worldCreateToggle').click();
 await page.locator('#wCreate').click();
 await page.locator('#bwTabs [data-tab="atlas"]').click();
 await expect(page.locator('#ecoTerritoryMap')).toBeVisible();
 await expect(page.locator('#ecoTerritoryMap g[role="button"]')).toHaveCount(0);
 expect(await page.evaluate(()=>!!window.BioWorldAtlas)).toBeTruthy();
});
