const puppeteer = require('puppeteer');

const contactPingwin = async ({name, phone, email, content}) => {
  const option = { 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'],
    slowMo: 30
  };

  const browser = await puppeteer.launch(option);
  const page = await browser.newPage();

  await page.goto('https://www.pingwin.co.il/', {waitUntil: 'networkidle2'});

  await page.type('form[class="contactForm"] input[name="cont_name"]', name);
  await page.type('form[class="contactForm"] input[name="cont_email"]', email);
  await page.type('form[class="contactForm"] input[name="cont_phone"]', phone);
  await page.type('form[class="contactForm"] textarea[name="cont_remarks"]', content);

  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'beforeSubmit.png' });
  
  await page.click('form[class="contactForm"] input[type="button"]');
  
  await page.waitForTimeout(5000);
  
  await page.screenshot({ path: 'afterSubmit.png' });

  await browser.close();
};

const contactDetails = {
  name: 'ישראל ישראלי',
  phone: '0541234567',
  email: 'israelisraeli972@gmail.com',
  content: 'שלום עולם'
};

contactPingwin(contactDetails);