const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context, callback) => {
  let result = null;
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    await page.goto('https://www.giraffe.co.il/contact-us');

    const submitButton = await page.waitForSelector('input[type="submit"]');

    const name = event.name;
    const phone = event.phone;
    const email = event.email;
    const branch = event.branch;
    const extraContent = event.extraContent;

    await page.type('input[name="field_1"]', name);
    await page.type('input[name="field_6"]', phone);
    await page.type('input[name="field_3"]', email);
    await page.select('select[name="field_5"]', branch);
    await page.type('textarea[name="field_4"]', extraContent);
    
    await submitButton.click();
    
    await page.waitForTimeout(5000);

    result = await page.title();
  } catch (error) {
    return callback(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return callback(null, result);
};