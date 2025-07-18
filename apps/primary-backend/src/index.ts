import express, { Request, Response } from "express";
import redisClient from "@repo/redis"; // client object

const PORT = 6000;
const app = express();

app.use(express.json());

async function main() {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  await redisClient.connect();
}

main().catch((error) => console.error("Error connecting to Redis:", error));

// api routes
app.get("/", (req: Request, res: Response) => {
  res.end("Hello world!");
});

// posting a post
app.post("/posts", async (req: Request, res: Response) => {
  // get the content
  const { userId, content, contentType } = req.body;
  console.log("Post Date :", { userId, content, contentType });

  try {
    // push into the queue
    await redisClient.lPush(
      "posts",
      JSON.stringify({ userId, content, contentType })
    );

    // posting request initiaited
    return res.json({ success: true, message: "Posting Post" }).status(200);
  } catch (error) {
    console.error("Error publishing message:", error);
    return res.json({ success: false, message: error }).status(400);
  }
});
