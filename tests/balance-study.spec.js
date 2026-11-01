const {test,expect}=require('@playwright/test');
const path=require('path');
test('60-turn ecological balance survey',async({page})=>{
 test.setTimeout(240000);
 await page.goto('file://'+path.resolve('index.html'));
 const out=await page.evaluate(()=>{
  const groups=[
   {name:'30sp-6biomes',count:30,biomes:[0,1,2,3,4,5]},
   {name:'60sp-6biomes',count:60,biomes:[0,1,2,3,4,5]},
   {name:'24sp-3biomes',count:24,biomes:[0,1,2]},
   {name:'24sp-2biomes',count:24,biomes:[0,1]},
   {name:'12sp-6biomes',count:12,biomes:[0,1,2,3,4,5]},
   {name:'36sp-4biomes',count:36,biomes:[0,1,3,5]},
  ];
  const records=[], colonizations=[], populations=[], speciesRows=[];
  for(const group of groups)for(let replicate=0;replicate<6;replicate++){
    const conf=structuredClone(DEFAULT);
    conf.seed=1001+replicate*417+groups.indexOf(group)*10007;
    conf.species_count=group.count;
    conf.enabled_biomes=group.biomes.map(i=>BIOMES[i].id);
    init(conf);
    const starts=world.species.map(sp=>sp.population.reduce((a,b)=>a+b,0));
    const firstArrival=new Map(),firstEstablished=new Map(),maxs=starts.slice(),mins=starts.slice();
    const arrivals=[],eventHistory=[];
    const prev=()=>world.species.map(sp=>sp.population.slice());
    let previous=prev();let localExtinctions=0,firstColonies=0,recoll=0,multiBiome=0;
    const seen=new Set();
    for(let turn=1;turn<=60;turn++){
      step();
      const now=prev();
      for(let i=0;i<world.species.length;i++){
        const sp=world.species[i],total=now[i].reduce((a,b)=>a+b,0);
        maxs[i]=Math.max(maxs[i],total);mins[i]=Math.min(mins[i],total);
        for(let b=0;b<6;b++){
         if(b===sp.home)continue;
         const k=i+'|'+b;
         if(previous[i][b]===0&&now[i][b]>0){
           const fresh=!seen.has(k);if(fresh){firstColonies++;seen.add(k)}else recoll++;
           arrivals.push({i,b,t:turn,fresh,adapt:sp.traits.adapt,pop:now[i][b]});
           if(fresh&&!firstArrival.has(i))firstArrival.set(i,turn);
         }
         if(previous[i][b]>0&&now[i][b]===0)localExtinctions++;
        }
      }
      previous=now;
      if(turn===10||turn===20||turn===40||turn===60){
       const species=world.species,totals=species.map(sp=>sp.population.reduce((a,b)=>a+b,0));
       const alive=totals.filter(n=>n>0).length;
       const change=totals.map((n,i)=>Math.abs(n-starts[i])/Math.max(1,starts[i]));
       populations.push({group:group.name,replicate,turn,alive,abundance:totals.reduce((a,b)=>a+b,0),richnessFraction:alive/species.length,gt50:change.filter(n=>n>=.5).length/species.length,gt100:change.filter(n=>n>=1).length/species.length});
      }
    }
    const survivors=world.species.filter(sp=>sp.population.some(n=>n>0)).length;
    const firsts=[...firstArrival.values()];
    const nowTotals=world.species.map(sp=>sp.population.reduce((a,b)=>a+b,0));
    const occupied=world.species.map(sp=>sp.population.filter(n=>n>0).length);
    records.push({group:group.name,seed:conf.seed,species:group.count,biomes:group.biomes.length,firstWorldTurn:firsts.length?Math.min(...firsts):null,meanFirstArrival:firsts.length?firsts.reduce((a,b)=>a+b,0)/firsts.length:null,speciesEverColonized:firsts.length,speciesColonizedBy60:firsts.length/group.count,newBiomePairs:firstColonies,recolonizations:recoll,localExtinctions,aliveAt60:survivors,occupiedBiomesAverage:occupied.reduce((a,b)=>a+b,0)/occupied.length,change50:nowTotals.filter((v,i)=>Math.abs(v-starts[i])/Math.max(1,starts[i])>=.5).length/group.count,change100:nowTotals.filter((v,i)=>Math.abs(v-starts[i])/Math.max(1,starts[i])>=1).length/group.count,ratioFinalTotal:nowTotals.reduce((a,b)=>a+b,0)/starts.reduce((a,b)=>a+b,0)});
    for(const a of arrivals)colonizations.push({group:group.name,seed:conf.seed,...a});
    world.species.forEach((sp,i)=>speciesRows.push({group:group.name,seed:conf.seed,id:i,adapt:sp.traits.adapt,diet:sp.diet,colonized:firstArrival.has(i),firstTurn:firstArrival.get(i)||null,final:nowTotals[i],start:starts[i],max:maxs[i],min:mins[i]}));
  }
  return {records,colonizations,speciesRows,populations};
 });
 const mean=arr=>arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:null;
 const firsts=out.speciesRows.filter(x=>x.colonized).map(x=>x.firstTurn);
 const summary={worlds:out.records.length,species:out.speciesRows.length,everColonized:out.speciesRows.filter(x=>x.colonized).length,firstArrivalMeanConditional:mean(firsts),firstArrivalMedian:firsts.sort((a,b)=>a-b)[Math.floor(firsts.length/2)]??null,firstWorldArrivalMean:mean(out.records.map(x=>x.firstWorldTurn).filter(Number.isFinite)),worldsWithoutArrival:out.records.filter(x=>x.firstWorldTurn===null).length,colonizations:out.colonizations.filter(x=>x.fresh).length,recolonizations:out.colonizations.filter(x=>!x.fresh).length,aliveAt60Mean:mean(out.records.map(x=>x.aliveAt60/x.species)),largeChange50Mean:mean(out.records.map(x=>x.change50)),largeChange100Mean:mean(out.records.map(x=>x.change100))};
 console.log('BIOWORLD_SURVEY_SUMMARY '+JSON.stringify(summary));
 console.log('BIOWORLD_SURVEY_WORLDS '+JSON.stringify(out.records));
 console.log('BIOWORLD_SURVEY_TRAITS '+JSON.stringify([1,2,3,4,5].map(adapt=>{const r=out.speciesRows.filter(x=>x.adapt===adapt);const a=r.filter(x=>x.colonized);return {adapt,species:r.length,colonized:a.length,rate:a.length/r.length,meanFirstArrival:mean(a.map(x=>x.firstTurn))}})));
 console.log('BIOWORLD_SURVEY_BY_GROUP '+JSON.stringify([...new Set(out.records.map(x=>x.group))].map(group=>{const r=out.records.filter(x=>x.group===group);const sp=out.speciesRows.filter(x=>x.group===group);return {group,worlds:r.length,meanFirstWorldArrival:mean(r.map(x=>x.firstWorldTurn).filter(Number.isFinite)),meanColonizerArrival:mean(sp.filter(x=>x.colonized).map(x=>x.firstTurn)),rateEverColonized:sp.filter(x=>x.colonized).length/sp.length,meanSurvivors:mean(r.map(x=>x.aliveAt60/x.species)),meanFinalPopulationRatio:mean(r.map(x=>x.ratioFinalTotal)),meanChange50:mean(r.map(x=>x.change50)),rangeFirstWorldTurn:[Math.min(...r.filter(x=>x.firstWorldTurn!==null).map(x=>x.firstWorldTurn)),Math.max(...r.filter(x=>x.firstWorldTurn!==null).map(x=>x.firstWorldTurn))]}})));
 console.log('BIOWORLD_SURVEY_COLONIZATION_TIMING '+JSON.stringify({
    firstTurnArrivals:out.colonizations.filter(a=>a.fresh&&a.t===1).length,
    byTurn5:out.colonizations.filter(a=>a.fresh&&a.t<=5).length,
    byTurn10:out.colonizations.filter(a=>a.fresh&&a.t<=10).length,
    byTurn20:out.colonizations.filter(a=>a.fresh&&a.t<=20).length,
    byTurn40:out.colonizations.filter(a=>a.fresh&&a.t<=40).length,
    byTurn60:out.colonizations.filter(a=>a.fresh&&a.t<=60).length,
    last20Recolonizations:out.colonizations.filter(a=>!a.fresh&&a.t>40).length,
    meanMigrationEventsPerWorld:out.colonizations.length/out.records.length,
    speciesNeverColonized:out.speciesRows.filter(x=>!x.colonized).length
 }));
 console.log('BIOWORLD_SURVEY_TIME '+JSON.stringify([10,20,40,60].map(turn=>{const r=out.populations.filter(x=>x.turn===turn);return {turn,meanAlive:mean(r.map(x=>x.richnessFraction)),meanAbundance:mean(r.map(x=>x.abundance)),meanChange50:mean(r.map(x=>x.gt50))}})));
 expect(out.records.length).toBe(36);
});