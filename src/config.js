module.exports = {
  awsRegion: "ap-south-1",

  sqsQueueUrl:
    "https://sqs.ap-south-1.amazonaws.com/123456789012/booking.fifo",

  cron: "0 * * * *", // every hour
  lastNDays: 30,

  visibilityTimeout: 300,
  maxConcurrentPagesPerTask: 3
};
