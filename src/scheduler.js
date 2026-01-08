const cron = require("node-cron");
const produceJobs = require("./producer");
const config = require("./config");

cron.schedule(config.cron, async () => {
  console.log("******** Scheduler triggered ********");
  await produceJobs();
});
