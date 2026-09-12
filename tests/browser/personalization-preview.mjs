// Maintenance Patch 8 acceptance against a local production preview.
// node tests/browser/personalization-preview.mjs /absolute/path/to/playwright/index.mjs http://127.0.0.1:4179
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';

const {chromium}=await import(pathToFileURL(process.argv[2]).href);
const base=process.argv[3]??'http://127.0.0.1:4179';
const cases=[['light',1280],['dark',1280],['light',375],['dark',375]];
const results=[];
const browser=await chromium.launch({headless:true});

try {
  for(const [theme,width] of cases){
    const context=await browser.newContext({viewport:{width,height:900},timezoneId:'Europe/Amsterdam',colorScheme:theme});
    await context.addInitScript(({key,value})=>localStorage.setItem(key,value),{key:'delftstudy.appearance.theme',value:theme});
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
    const fits=async label=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${label} overflow at ${theme}/${width}`);
    const navigate=async path=>{
      await page.evaluate(next=>{history.pushState({},'',next);dispatchEvent(new PopStateEvent('popstate'));},path);
      await page.waitForTimeout(150);
    };

    await page.goto(base+'/');
    await page.locator('.ds-app').waitFor({timeout:10000});
    await page.getByRole('heading',{name:'Upcoming Exams',exact:true}).waitFor();
    assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),theme);
    await fits('Dashboard');
    const add=page.getByRole('button',{name:'Add exam',exact:true});
    assert((await add.getAttribute('class')).includes('ds-button-primary'));
    await add.click();
    await page.getByRole('dialog').waitFor();
    for(const name of ['Exam day','Exam month','Exam year']){
      const box=await page.getByRole('combobox',{name}).boundingBox();
      assert(box&&box.height>=44,`${name} is below the touch target`);
    }
    assert((await page.getByRole('button',{name:'Save exam'}).getAttribute('class')).includes('ds-button-primary'));
    assert((await page.getByRole('button',{name:'Cancel'}).getAttribute('class')).includes('ds-button-quiet'));
    await fits('Exam picker');
    await page.getByRole('button',{name:'Cancel'}).click();

    await navigate('/account');
    await page.getByRole('heading',{name:'Account & cloud sync',exact:true}).waitFor();
    for(const heading of ['Profile','Appearance','Security','Sync & Backup','Data & Privacy'])
      await page.getByRole('heading',{name:heading,exact:true}).waitFor();
    assert.equal(await page.locator('input[name=theme]').count(),3);
    await fits('Account');

    for(const [path,heading] of [['/practice','Practice'],['/study-plan','Study Path'],['/progress','Progress']]){
      await navigate(path);
      await page.getByRole('heading',{name:heading,exact:true}).waitFor();
      await fits(heading);
    }

    await navigate('/practice/ds.practice.interactive-rl-conditional');
    await page.getByRole('button',{name:'Start exercise',exact:true}).click();
    await page.locator('.logic-workspace').waitFor();
    await fits('Logical builder');
    await navigate('/practice/ds.practice.interactive-co-map-two');
    await page.getByRole('button',{name:'Start exercise',exact:true}).click();
    await page.locator('.logic-map').waitFor();
    await fits('Karnaugh map');
    await navigate('/co/CO_T06_ASSEMBLY_X86_64/visualizer');
    await page.locator('.workspace-grid').waitFor();
    assert(await page.locator('.ds-app').evaluate(element=>element.classList.contains('ds-tool')));
    await fits('Assembly Visualizer');
    assert.deepEqual(errors,[]);
    results.push({theme,width,pages:8,overflow:'PASS',errors:0});
    await context.close();
  }

  const context=await browser.newContext({viewport:{width:768,height:900},colorScheme:'dark'});
  await context.addInitScript(key=>localStorage.setItem(key,'system'),'delftstudy.appearance.theme');
  const page=await context.newPage();
  await page.goto(base+'/');
  await page.locator('.ds-app').waitFor({timeout:10000});
  assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'dark');
  await page.emulateMedia({colorScheme:'light'});
  await page.waitForFunction(()=>document.documentElement.dataset.theme==='light');
  assert.equal(await page.evaluate(()=>document.documentElement.dataset.themePreference),'system');
  results.push({theme:'system',width:768,resolves:'dark then light without reload'});
  await context.close();
  console.log(JSON.stringify({engine:'Chromium',base,results},null,2));
} finally {
  await browser.close();
}
