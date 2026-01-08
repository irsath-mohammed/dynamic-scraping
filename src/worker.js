const { receiveMessage, deleteMessage, sendMessage } = require("./sqs");
const { launchBrowser } = require("./puppeteerBrowser");
const buildUrl = require("./urlBuilder");
const config = require("./config");

let shuttingDown = false;

process.on("SIGTERM", () => {
  shuttingDown = true;
  console.log("SIGTERM received");
});

async function scrapeAndDiscoverPages(payload) {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  await page.goto(buildUrl(payload), { waitUntil: "networkidle" });

  const totalPages = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="pagination"]');
    if (!el) return 1;
    return el.querySelectorAll("li").length;
  });

  await browser.close();
  return totalPages;
}

(async function worker() {
  while (!shuttingDown) {
    const msg = await receiveMessage();
    if (!msg) continue;

    const payload = JSON.parse(msg.Body);
    const { country, date, page } = payload;

    try {
      const totalPages = await scrapeAndDiscoverPages(payload);

      if (page === 1 && totalPages > 1) {
        const limit = Math.min(
          totalPages,
          config.maxConcurrentPagesPerTask
        );

        for (let p = 2; p <= limit; p++) {
          await sendMessage(
            { country, date, page: p },
            country,
            `${country}-${date}-${p}`
          );
        }
      }

      await deleteMessage(msg.ReceiptHandle);
    } catch (err) {
      console.error("Worker error:", err.message);
    }
  }
})();
