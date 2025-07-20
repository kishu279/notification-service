import redisClient from "@repo/redis";

const publisher = redisClient.duplicate();
// const subscriber = redisClient.duplicate(); // no use for now

async function conenctToRedis() {
  try {
    await redisClient.connect();
    await publisher.connect();
    // await subscriber.connect();
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
}

async function main() {
  // never ending loop who will take care of the queue lookup
  await conenctToRedis();
  while (true) {
    try {
      // wait for a message from the queue
      const message = await redisClient.brPop("INSTA_POSTS", 0);
      const parsedData = JSON.parse(message?.element || "{}");

      // do something
      await doSomething(parsedData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error in worker loop:", error);
      const timer = setTimeout(() => {
        // incase of any error
        main();
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }
}

// worker logic
async function doSomething(message: any) {
  console.log("Doing something in the worker...");
  // Simulate some
  console.log("Message received from queue:", message);

  try {
    setTimeout(() => {
      console.log("Message:", message);
      const stringifiedMessage = JSON.stringify({
        userId: message.userId,
        type: "notification",
        status: "success",
        data: "notification sent",
        roomId: message.roomId,
      });

      // PUBLISH on the channel "POSTS"
      publisher.publish("POSTS", stringifiedMessage);
      console.log("Message published to channel POSTS");
    }, 2000);
  } catch (error) {
    console.error("Error in doSomething:", error);
    // again do something
  }
}

main();
