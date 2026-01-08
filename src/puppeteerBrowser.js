const puppeteer = require("puppeteer");
const { getProxy } = require("./proxyManager");

exports.launchBrowser = async () => {
  const proxy = getProxy();

  return puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      `--proxy-server=${proxy}`
    ]
  });
};
