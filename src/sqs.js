const {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand
} = require("@aws-sdk/client-sqs");

const config = require("./config");

const sqs = new SQSClient({ region: config.awsRegion });

exports.sendMessage = async (payload, groupId, dedupId) => {
  await sqs.send(new SendMessageCommand({
    QueueUrl: config.sqsQueueUrl,
    MessageBody: JSON.stringify(payload),
    MessageGroupId: groupId,
    MessageDeduplicationId: dedupId
  }));
};

exports.receiveMessage = async () => {
  const res = await sqs.send(new ReceiveMessageCommand({
    QueueUrl: config.sqsQueueUrl,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 20,
    VisibilityTimeout: config.visibilityTimeout
  }));
  return res.Messages?.[0];
};

exports.deleteMessage = async (receiptHandle) => {
  await sqs.send(new DeleteMessageCommand({
    QueueUrl: config.sqsQueueUrl,
    ReceiptHandle: receiptHandle
  }));
};
