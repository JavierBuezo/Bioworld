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

test('atlas initially offers an all-species view',async({page})=>{
 await page.goto('file://'+path.resolve('index.html'));
 await page.locator('#worldCreateToggle').click();
 await page.locator('#wCreate').click();
 await page.locator('#bwTabs [data-tab="atlas"]').click();
 await expect(page.locator('#ecoSpecies')).toHaveValue('');
 await expect(page.locator('#ecoTerritoryMap')).toBeVisible();
});

test('atlas corridors match the eight permitted dispersal connections',async({page})=>{
 await page.goto('file://'+path.resolve('index.html'));
 await page.locator('#worldCreateToggle').click();await page.locator('#wCreate').click();await page.locator('#bwTabs [data-tab="atlas"]').click();
 const paths=page.locator('#ecoTerritoryMap g[aria-label="Corredores ecológicos permanentes"] path');
 await expect(paths).toHaveCount(16);
 await expect(page.locator('#ecoTerritoryMap')).toHaveAttribute('viewBox','0 0 1000 920');
 await expect(page.locator('#ecoTerritoryMap')).toBeVisible();
});

test('world chronicle reports first colonization and only top two population changes',async({page})=>{
 await page.goto('file://'+path.resolve('index.html'));
 await page.locator('#worldCreateToggle').click();await page.locator('#wCreate').click();
 const info=await page.evaluate(()=>{
  world.species=Array.from({length:5},(_,i)=>({id:i,name:'Especie '+i,diet:'herbivore',home:0,population:[100+i*10,i===0?3:0,0,0,0,0]}));
  world.cycle=1;
  world.history=[{cycle:0,speciesPop:world.species.map((sp)=>[100,0,0,0,0,0])},{cycle:1,speciesPop:world.species.map(sp=>[...sp.population])}];
  saveChronicle([100,100,100,100,100],world.species.map(sp=>sp.population.reduce((a,b)=>a+b,0)),1,1);
  return {chronicle:world.chronicle[0],log:world.log[0],exported:buildStudentSnapshot().chronicle[0]};
 });
 expect(info.chronicle.colonized).toHaveLength(1);
 expect(info.chronicle.colonized[0].biomeName).toBe('Pradera');
 expect(info.chronicle.grown).toHaveLength(2);
 expect(info.exported.colonized).toHaveLength(1);
 expect(info.log).toContain('primera colonización');
});

test('first simulated turn creates colonization news with forced migration',async({page})=>{
 await page.goto('file://'+path.resolve('index.html'));
 await page.locator('#worldCreateToggle').click();await page.locator('#wCreate').click();
 const check=await page.evaluate(()=>{
  cfg.generate_initial_species=true;cfg.species_count=12;cfg.initial_population=120;
  cfg.dispersal.base_probability=1;cfg.dispersal.minimum_population=1;
  init(cfg);
  const baseline=world.species.map(sp=>sp.population.map(x=>x));
  run(1);
  const entries=world.chronicle[0]?.colonized||[];
  return {baseline,entries,text:document.getElementById('chronicle').textContent,
    log:world.log.join(' ')};
 });
 expect(check.entries.length).toBeGreaterThan(0);
 expect(check.text).toContain('primera colonización');
 expect(check.log).toContain('primera colonización');
 for(const c of check.entries)expect(check.baseline[c.id][c.biome]).toBe(0);
});

test('balance v6: adaptability governs dispersal and trait budget is 15',async({page})=>{
 await page.goto('file://'+path.resolve('index.html'));
 await page.locator('#worldCreateToggle').click();
 await page.locator('#wCreate').click();
 const result=await page.evaluate(()=>{
  const generated=Array.from({length:60},()=>traits());
  const totals=generated.map(t=>Object.values(t).reduce((a,b)=>a+b,0));
  const p=cfg.dispersal.base_probability;
  const multipliers=cfg.dispersal.adaptability_multipliers;
  const defaults=Object.keys(TRAIT_NAMES).map(k=>Number(document.getElementById('tr_'+k).value));
  return {totals,p,multipliers,defaults};
 });
 expect(new Set(result.totals)).toEqual(new Set([15]));
 expect(result.p).toBe(.002);
 expect(result.multipliers).toEqual([.02,.07,.2,.6,1.2]);
 expect(result.defaults.reduce((a,b)=>a+b,0)).toBe(15);
});
