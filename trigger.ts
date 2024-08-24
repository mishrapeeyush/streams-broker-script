import redis_provider from "@providers/redis";
import { StreamChannelBroker } from "redis-streams-broker";

interface Data {
  payload: Record<string, any>;
  type: string;
}

interface StreamEventPayload {
  type: string;
  companyId: string;
  data: Data;
  queue_name: string;
}

const redisClient = redis_provider.createClient();
const relayEventsBroker: any = new StreamChannelBroker(redisClient, "OND_MEDIA_EVENTS");

const payloads: StreamEventPayload = {
  queue_name: "VectorStorageSyncQueue",
  data: {
    payload: { namespace: "plugin-1721385613-vector-store_db_events" },
    type: "moveNamespaceHotToColdStorage"
  },
  type: "asynq_queue",
  companyId: "user555"
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
