const puppeteer = require('puppeteer');

const contactSkideal = async ({name, phone, email}) => {
  const option = { 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'],
    slowMo: 30
  };

  const browser = await puppeteer.launch(option);
  const page = await browser.newPage();

  await page.goto('https://www.skideal.co.il/contact-us/');
  
  const submitButton = await page.waitForSelector('.contact-page-form input[type="submit"]');

  await page.type('.contact-page-form input[name="full-name"]', name);
  await page.type('.contact-page-form input[name="your-tel"]', phone);
  await page.type('.contact-page-form input[name="email"]', email);

  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'beforeSubmit.png', fullPage: 'true' });

  await submitButton.click();
  
  await page.waitForTimeout(10000);
  // await await page.waitForNavigation();
  
  await page.screenshot({ path: 'afterSubmit.png', fullPage: 'true' });

  await browser.close();
};

const contactDetails = {
  name: 'ישראל ישראלי',
  phone: '0541234567',
  email: 'israelisraeli972@gmail.com'
};

contactSkideal(contactDetails);