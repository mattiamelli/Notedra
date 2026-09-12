// Anonymous desktop/mobile acceptance against a local production preview.
// node tests/browser/upcoming-preview.mjs /absolute/path/to/playwright/index.mjs
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.argv[2]).href);
const browser=await chromium.launch({headless:true});
try {
  for (const width of [1280,375]) {
    const context=await browser.newContext({viewport:{width,height:900},timezoneId:'Europe/Amsterdam'});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    const fits=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow at '+width);
    try {
      await page.goto('http://127.0.0.1:4173/');
      await page.getByRole('heading',{name:'Upcoming Exams',exact:true}).waitFor();
      await page.getByRole('button',{name:'+ Add exam',exact:true}).click();
      await page.getByLabel('Exam name',{exact:true}).fill('Disposable preview exam');
      await page.getByLabel('Exam date',{exact:true}).fill('2028-02-29');
      await fits(); await page.getByRole('button',{name:'Save',exact:true}).click();
      await page.getByText('Disposable preview exam',{exact:true}).waitFor();
      await page.reload();await page.getByText('Disposable preview exam',{exact:true}).waitFor();
      await page.getByRole('button',{name:'Edit',exact:true}).click();
      await page.getByLabel('Exam name',{exact:true}).fill('Edited preview exam');
      await page.getByRole('button',{name:'Save',exact:true}).click();
      await page.getByText('Edited preview exam',{exact:true}).waitFor();await fits();
      await page.screenshot({path:`/tmp/p2-dashboard-${width}.png`,fullPage:true});
      page.once('dialog',dialog=>dialog.accept());
      await page.getByRole('button',{name:'Delete',exact:true}).click();
      await page.getByText('Add an exam date to keep it in view.',{exact:true}).waitFor();
      await page.goto('http://127.0.0.1:4173/account');
      await page.getByRole('heading',{name:'Sign in',exact:true}).waitFor();
      assert.equal(await page.getByText('Cloud sync is not configured',{exact:false}).count(),0);
      await page.getByRole('button',{name:'Create an account instead',exact:true}).click();
      const name=page.getByLabel('Display name',{exact:true});await name.fill('Disposable Preview');
      await name.focus();assert(await name.evaluate(e=>e===document.activeElement));
      await page.keyboard.press('Tab');assert(await page.getByLabel('Email',{exact:true}).evaluate(e=>e===document.activeElement));
      await fits();await page.screenshot({path:`/tmp/p2-account-${width}.png`,fullPage:true});
      assert.deepEqual(errors,[]);
      console.log(`PASS ${width}px Chromium: anonymous add/edit/delete/reload, configured account/signup name, keyboard focus, no overflow or page errors. No signup submitted.`);
    } finally {await context.close();}
  }
} finally {await browser.close();}
