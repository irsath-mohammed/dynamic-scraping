const countries = require("./countries");
const { sendMessage } = require("./sqs");
const config = require("./config");

module.exports = async function produceJobs() {
  const today = new Date();

  for (const country of countries) {
    for (let i = 0; i < config.lastNDays; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const date = d.toISOString().split("T")[0];

      await sendMessage(
        { country, date, page: 1 },
        country,
        `${country}-${date}-1`
      );
    }
  }

  console.log("✅ Producer: Page-1 jobs queued");
};
