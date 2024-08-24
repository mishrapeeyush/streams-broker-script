import redis_provider from "@providers/redis";
import { StreamChannelBroker } from "redis-streams-broker";
interface Payload {
  // type: string;
  queue_name: string;
  payload: Record<string, any>;
  type: string;
}
const redisClient = redis_provider.createClient();
const relayEventsBroker: any = new StreamChannelBroker(redisClient, "RelayEvents");
const payloads: Payload = {
  // type: "ProcessExecutor",
  queue_name: "AsynqFunc",
  payload: { age: "23" },
  type: "asynq_queue",
};
(async () => {
  try {
    const broker = await relayEventsBroker.publish({ payload: JSON.stringify(payloads) });
    console.log("Message published to Redis stream", payloads, " ", broker);
  } catch (error) {
    console.error("Error publishing message:", error);
  } finally {
    redisClient.quit();
  }
})();
