const fs = require('fs');
const path = require('path');

const puppeteer = require('puppeteer');

const Server = require('./server');

module.exports = async ({ outfile }) => {
  const port = 4251;
  const server = new Server({ port });

  const [browser] = await Promise.all([
    puppeteer.launch({ headless: true }),
    server.start(),
  ]);

  const page = await browser.newPage();
  
  await page.goto(`http://localhost:${port}`);
  
  await page.emulateMedia('print');
    
  const pdf = await page.pdf({
    path: outfile,
    format: 'letter',
    scale: 0.72,
    margin: {
      top: '0.38in',
      bottom: '0.38in',
      left: '0.38in',
      right: '0.38in',
    },
  });

  await Promise.all([browser.close(), server.stop()]);

  return outfile;
};
