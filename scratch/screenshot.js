const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;
const docRoot = path.join(__dirname, '..');

app.use(express.static(docRoot));

const server = app.listen(port, async () => {
    console.log(`Server started on http://localhost:${port}`);
    
    const viewports = [
        { width: 360, height: 800, name: '360x800' },
        { width: 768, height: 1024, name: '768x1024' },
        { width: 1024, height: 768, name: '1024x768' },
        { width: 1280, height: 800, name: '1280x800' },
        { width: 1366, height: 768, name: '1366x768' },
        { width: 1440, height: 900, name: '1440x900' },
        { width: 1920, height: 1080, name: '1920x1080' }
    ];
    
    const prefix = process.argv[2] || 'before';
    const dir = path.join(docRoot, 'screenshots', prefix);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    for (let vp of viewports) {
        await page.setViewport({ width: vp.width, height: vp.height });
        await page.goto(`http://localhost:${port}/index.html`, { waitUntil: 'networkidle0' });
        await page.screenshot({ path: path.join(dir, `${vp.name}.png`), fullPage: true });
        console.log(`Saved screenshot for ${vp.name}`);
    }
    
    await browser.close();
    server.close();
});
