import redisClient from "@repo/redis";

// worker logic
// never ending loop who will take care of the queue lookup

async function main() {
  // connection to redis
  await redisClient.connect().catch((error) => {
    console.error("Error connecting to Redis:", error);
    throw new Error("Redis connection failed");
  });

  while (true) {
    try {
      // wait for a message from the queue
      const message = await redisClient.brPop("posts", 0);
      console.log("Message received from queue:", message);

      // do something
      // await doSomething();

      console.log("Message Processed");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error in worker loop:", error);
      setTimeout(() => {
        // incase of any error
        main();
      }, 5000);
    }
  }
}

async function doSomething() {
  console.log("Doing something in the worker...");
  // Simulate some work
}

main();
