/**
 * Scrapes Australian Museum FrogID website for frog call links
 * Author: Cong Nguyen
 * Usage: node index.js > frogs.csv
 * 
 */

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://www.frogid.net.au/explore');

  // Expand list of frogs
  let filterBySpecies_button = await page.$x("//button[contains(., 'Filter by Species')]");
  filterBySpecies_button = filterBySpecies_button[0];
  await filterBySpecies_button.evaluate(filterBySpecies_button => filterBySpecies_button.click());

  // Wait for map and list of frogs to load
  const listOfFrogsButtonsXPath = '//span[text()="Filter by Species"]/../../div[2]/ul/li/button';
  await page.waitForXPath(listOfFrogsButtonsXPath);
  let numberOfFrogs = await page.$x(listOfFrogsButtonsXPath);
  numberOfFrogs = numberOfFrogs.length;
  
  console.log('common name,scientific name,cloudinary url')
  for (let i = 1; i <= numberOfFrogs; i++) {
    let buttonXPath = `//ul/li[${i}]/button`;
    let commonNameXPath = `//ul/li[${i}]/button/div/h3`;
    let scientificNameXPath = `//ul/li[${i}]/button/div/h4`;
    let audioXPath = `//ul/li[${i}]/audio`;

    let commonNameEl = await page.$x(commonNameXPath);
    let scientificNameEl = await page.$x(scientificNameXPath);

    commonNameEl = commonNameEl[0];
    scientificNameEl = scientificNameEl[0];

    let button = await page.$x(buttonXPath);
    button = button[0];
    await button.evaluate(button => button.click());
    await page.waitForXPath(audioXPath);

    let audioEl = await page.$x(audioXPath);
    audioEl = audioEl[0];

    const commonName = await page.evaluate(elm => elm.textContent, commonNameEl);
    const scientificName = await page.evaluate(elm => elm.textContent, scientificNameEl);
    const audioSrc = await page.evaluate(elm => elm.getAttribute('src'), audioEl);
    console.log(`${commonName},${scientificName},${audioSrc}`);
  }

  await browser.close();
})();
