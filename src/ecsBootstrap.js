const {
  ECSClient,
  DescribeServicesCommand,
  UpdateServiceCommand
} = require("@aws-sdk/client-ecs");

const ecs = new ECSClient({ region: "ap-south-1" });

module.exports = async function ensureEcsRunning() {
  const res = await ecs.send(new DescribeServicesCommand({
    cluster: "booking-cluster",
    services: ["booking-worker"]
  }));

  const service = res.services[0];
  if (service.desiredCount === 0) {
    await ecs.send(new UpdateServiceCommand({
      cluster: "booking-cluster",
      service: "booking-worker",
      desiredCount: 1
    }));
  }
};
