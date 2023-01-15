const puppeteer = require('puppeteer');

const contactGiraffe = async ({name, phone, email, branch, extraContent}) => {
  const option = { 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'],
    slowMo: 30
  };

  const browser = await puppeteer.launch(option);
  const page = await browser.newPage();

  await page.goto('https://www.giraffe.co.il/contact-us');

  const submitButton = await page.waitForSelector('input[type="submit"]');

  await page.type('input[name="field_1"]', name);
  await page.type('input[name="field_6"]', phone);
  await page.type('input[name="field_3"]', email);
  await page.select('select[name="field_5"]', branch);
  await page.type('textarea[name="field_4"]', extraContent);

  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'beforeSubmit.png', fullPage: 'true' });
  
  await submitButton.click();
  
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'afterSubmit.png', fullPage: 'true' });

  await browser.close();
};

const contactDetails = {
  name: 'ישראל ישראלי',
  phone: '0541234567',
  email: 'israelisraeli972@gmail.com',
  branch: "ג'ירף הרצליה",
  extraContent: 'שלום עולם'
};

contactGiraffe(contactDetails);