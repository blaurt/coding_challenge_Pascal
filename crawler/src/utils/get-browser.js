const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

async function getBrowser(asin) {
  const width = 4019
  const height = 1900
  const browser = await puppeteer.launch({
    args: [
      `--window-size=${width},${height}`,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--disable-dev-shm-usage',
      '--disable-features=VizDisplayCompositor',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
      '--user-agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) snap Chromium/81.0.4044.113 Chrome/81.0.4044.113 Safari/537.36"'
    ]
  })
  const page = await browser.newPage()
  const url = `https://amazon.com/dp/${asin}`;
  console.log("🚀 ~ CRAWLER: url", url)
  await page.goto(url)
  await page.screenshot({ path: 'amazone-home.png' })

  const pageTitle = await page.title();
  console.log("🚀 ~ CRAWLER: page.title is:\n\n", pageTitle)
  return browser
}

module.exports = {
    getBrowser
}