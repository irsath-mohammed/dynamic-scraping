//****WILL RUN ONCE NOT PART OF RUNTIME****
// Configures ECS auto scaling
//  AWS remembers this forever
import {
  ApplicationAutoScalingClient,
  RegisterScalableTargetCommand,
  PutScalingPolicyCommand
} from "@aws-sdk/client-application-auto-scaling";

const client = new ApplicationAutoScalingClient({
  region: process.env.AWS_REGION
});

(async () => {
  const resourceId = `service/${process.env.CLUSTER}/${process.env.SERVICE}`;

  await client.send(new RegisterScalableTargetCommand({
    ServiceNamespace: "ecs",
    ResourceId: resourceId,
    ScalableDimension: "ecs:service:DesiredCount",
    MinCapacity: 0,
    MaxCapacity: 100
  }));

  await client.send(new PutScalingPolicyCommand({
    PolicyName: "booking-sqs-scaling",
    ServiceNamespace: "ecs",
    ResourceId: resourceId,
    ScalableDimension: "ecs:service:DesiredCount",
    PolicyType: "TargetTrackingScaling",
    TargetTrackingScalingPolicyConfiguration: {
      TargetValue: 5,
      PredefinedMetricSpecification: {
        PredefinedMetricType: "SQSQueueAverageMessagesVisible",
        ResourceLabel: process.env.SQS_RESOURCE_LABEL
      },
      ScaleOutCooldown: 60,
      ScaleInCooldown: 180
    }
  }));

  console.log("ECS Auto Scaling configured");
})();