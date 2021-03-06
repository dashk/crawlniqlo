const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');

(async function() {
  async function launchChrome() {
    return await chromeLauncher.launch({
      chromeFlags: [
        '--disable-gpu',
        '--headless'
      ]
    });
  }
  const chrome = await launchChrome();
  const protocol = await CDP({
    port: chrome.port
  });

  const {
    DOM,
    Page,
    Emulation,
    Runtime
  } = protocol;
  await Promise.all([Page.enable(), Runtime.enable(), DOM.enable()]);

  Page.navigate({
    url: 'https://www.uniqlo.com/us/en/men-packaged-dry-crewneck-short-sleeve-t-shirt-404132.html'
  });

  Page.loadEventFired(async() => {
    const extractPrice = "document.querySelector('[itemprop=offers] [itemprop=price]').textContent"

    // Evaluate extractPrice script
    const result = await Runtime.evaluate({
      expression: extractPrice
    });
    console.log(result.result.value);

    protocol.close();
    chrome.kill(); 
  });
})();
