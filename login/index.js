const puppeteer = require('puppeteer');

const NotionSession = async () => {
    const option = { 
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized'],
        slowMo: 50
    };

    const browser = await puppeteer.launch(option);
    const page = await browser.newPage();

    const email = "snirpinievsky@gmail.com";
    const password = "GGJ28Fx9zSVjB5m";
    await login(page, email, password);

    const notionPageName = "MonTo-Do";
    const templateName = "To-do list";
    await addNewNotionPage(page, notionPageName, templateName);

    await prepareMyTodoList(page);

    await browser.close();
};

NotionSession();

async function login(page, email, password) {
    await page.goto('https://www.notion.so/');

    await page.click('nav[aria-label="Primary Navigation"] a[href="/login"]');
    await page.waitForSelector('form input[type="email"]');

    const emailInput = await page.$('form input[type="email"]');
    await emailInput.type(email);
    await emailInput.press('Enter');
    
    await page.waitForTimeout(500);
    const passwordInput = await page.$('form input[type="password"]');
    await passwordInput.type(password);
    await page.waitForTimeout(500);
    await passwordInput.press('Enter');
}

async function addNewNotionPage(page, pageName, templateName) {
    // Add new page
    await clickNavButton(page, "Add a page");

    await setNotionPageTemplate(page, templateName);

    // Click on page name
    const pageNameButton = await page.waitForXPath(`//div[@class="notion-topbar"]//div[@role='button' and .//div[@class="notranslate"]]`);
    await pageNameButton.click();
    
    // Rename
    const pageNameInput = await page.waitForXPath(`//div[@class="notion-overlay-container notion-default-overlay-container"]//div[@placeholder='Untitled']`);
    await pageNameInput.type(pageName);
    await pageNameInput.press('Enter');
}

async function clickNavButton(page, buttonText) {
    await page.waitForSelector('.notion-sidebar-container');
    const buttonToClick = await page.waitForXPath(`//nav//div[@role='button']//div[contains(text(), "${buttonText}")]`);
    await buttonToClick.click();
}

async function setNotionPageTemplate(page, templateName) {
    // Open templates overlay
    const templatesBtn = await page.waitForXPath(`//div[@class="notion-page-content"]//div[@role='button' and contains(text(), "Templates")]`);
    await templatesBtn.click();

    // Search for the template
    const templateNameInput = await page.waitForXPath(`//div[@class="notion-overlay-container notion-default-overlay-container"]//input[@placeholder='Search templates']`);
    await templateNameInput.type(templateName, {delay: 50});

    // Choose the template
    const templateBtn = await page.waitForXPath(`//div[@class="notion-overlay-container notion-default-overlay-container"]//div[@role="button"]//*[contains(text(), "${templateName}")]`);
    await templateBtn.click();

    // Get the template
    const getTemplateBtn = await page.waitForXPath(`//div[@class="notion-overlay-container notion-default-overlay-container"]//div[@role="button" and contains(text(), "Get template")]`);
    await getTemplateBtn.click();
}

async function prepareMyTodoList(page) {
    // Delete Templates items
    for (let i = 0; i < 3; i++) {
        const tableItems = await page.$$(".notion-frame .notion-table-view .notion-collection-item");
        await tableItems[0].click({button: 'right'});
        const deleteBtn = await page.waitForXPath('//div[@class="notion-overlay-container notion-default-overlay-container"]//div[contains(text(), "Delete")]');
        await deleteBtn.click();
    }

    // Add tasks
    const tasks = ["Login", "Create MonTo-Do page", "Add tasks", "Change icon"];
    for (const i in tasks) {
        await addNewTask(page, tasks[i]);
    }

    // Mark check all finished tasks
    for(let i = 0; i < tasks.length - 1; i++) {
        await markCheck(page, tasks[i]);
    }

    // Change page icon and mark task as finished
    const iconName = "white heavy check mark";
    await changePageIcon(page, iconName);
    await markCheck(page, tasks[tasks.length - 1]);

    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'afterAll.png', fullPage: 'true' });
}

async function addNewTask(page, taskName) {
    // Click add new task
    const addNewRowBtn = await page.waitForXPath('//div[@class="notion-frame"]//div[@class="notion-table-view-add-row notion-focusable"]')
    await addNewRowBtn.click();

    // // Click task name title
    // const taskNameTitle = await page.waitForXPath('//div[@class="notion-frame"]//div[@class="notion-table-view"]//div[@class="notion-selectable notion-page-block notion-collection-item"]//span[not(text())]');
    // await taskNameTitle.click();

    // Type task name
    const newLineInput = await page.waitForSelector('div[class="notion-overlay-container notion-default-overlay-container"] div[placeholder=" "]');
    await newLineInput.type(taskName);
    await newLineInput.press('Enter');
}

async function markCheck(page, taskName) {
    const taskTableItem = await page.waitForXPath(`//div[@class="notion-frame"]//div[@class="notion-table-view"]//div[@class="notion-selectable notion-page-block notion-collection-item" and .//span[contains(text(), "${taskName}")]]`)
    
    const checkBoxBtn = await taskTableItem.waitForXPath('.//div[@role="button" and .//*[contains(@class, "check")]]');
    await checkBoxBtn.click();
}

async function changePageIcon(page, emojiName) {
    // Click on page icon
    const pageIconBtn = await page.waitForSelector('.notion-frame .notion-record-icon');
    await pageIconBtn.click();

    // Search for wanted icon
    const searchInput = await page.waitForSelector('.notion-overlay-container.notion-default-overlay-container .notion-media-menu input');
    await searchInput.type(emojiName);

    // Click on wanted icon
    const wantedIcon = await page.waitForSelector('.notion-overlay-container.notion-default-overlay-container .notion-media-menu div[role="button"] img[class="notion-emoji"]');
    await wantedIcon.click();
}