import redisClient from "@repo/redis";
import { createServer } from "http";
import express from "express";
import { WebSocket, WebSocketServer } from "ws";

const PORT = 3020;
const CHANNEL = "POSTS";

// data structures to manage connections and user data
const connectionsByRoom: Map<string, Set<WebSocket>> = new Map();
const userIdByRoom: Map<string, Set<string>> = new Map();
const connectionToUser: Map<string, WebSocket> = new Map();
const userIdToRoomId: Map<string, string> = new Map(); // roomId to userId
const userToConnection: Map<WebSocket, string> = new Map();

const pendingNotifications: Map<string, Set<any>> = new Map();

// http server
const server = createServer();
const app = express();
const wss = new WebSocketServer({ server });

const publisher = redisClient.duplicate();
const subscriber = redisClient.duplicate();

async function conenctToRedis() {
  try {
    await redisClient.connect();
    await publisher.connect();
    await subscriber.connect();

    // subscribe event
    await subscriber.subscribe("POSTS", (message, channel) => {
      if (channel !== CHANNEL) {
        console.log("error not found channel");
      }

      const parsedData = JSON.parse(message);
      console.log("###Parsed Data:", parsedData);
      handleRedisMessage(parsedData);
    });
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
}

async function handleRedisMessage(parsedData: any) {
  // check for the type of message either is the chat or notification
  const { type, userId, status, data, roomId } = parsedData;

  switch (type) {
    case "notification":
      // 1. user related updates
      const userWs = connectionToUser.get(userId); // get ws
      // console.log("User WebSocket:", userWs);
      console.log("User ID:", userId);
      if (userWs) {
        userWs.send(JSON.stringify({ type: "notification", data }));
        console.log("Notification sent to user:", userId);
        console.log("Data:", data);
        console.log("Status:", status);
      } else {
        // pending notifications push into the queue
        if (!pendingNotifications.has(userId)) {
          pendingNotifications.set(userId, new Set());
        }
        pendingNotifications.get(userId)?.add(data);
        console.log("Pending notification for user:", userId);
      }

      // 2. post related updates
      //
      // to all the users friend or in the room
      break;
    case "chat":
      // HANDLE MESSAGE BROADCASTING
      break;
  }
}

function main() {
  server.listen(PORT, () => {
    console.log(`WebSocket server is running on http://localhost:${PORT}`);
  });

  server.on("request", app);
}

// wesocket server handling
wss.on("connection", (ws: WebSocket) => {
  console.log("connected");

  ws.on("open", () => {
    console.log("WebSocket connection open");
  });
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
  ws.on("close", () => {
    console.log("WebSocket connection closed");
    // remove the connection from the map
    const userId = userToConnection.get(ws);

    const roomId = userIdToRoomId.get(userId!);
    connectionsByRoom.get(roomId!)?.delete(ws); // remove from room
    userIdByRoom.get(roomId!)?.delete(userId!); // remove from userIdByRoom
    connectionToUser.delete(userId!); // remove from connectionToUser
    userIdToRoomId.delete(userId!); // remove from userIdToRoomId
    userToConnection.delete(ws); // remove from userToConnection

    // all connections clear in the room with user
    console.log(`User ${userId} disconnected from room ${roomId}`);
    console.log(
      "User connections in room after disconnect:",
      connectionsByRoom.get(roomId!)?.size
    );

    console.log("### DEBUG ###");
    console.log("User Id By Room: ", userIdByRoom.get(roomId!));
  });

  // handle incoming messages
  ws.on("message", (message: string) => {
    const parsedData = JSON.parse(message);

    const { type, userId, status, data, roomId } = parsedData;

    switch (type) {
      case "join":
        // join a room
        if (!connectionsByRoom.get(roomId)) {
          connectionsByRoom.set(roomId, new Set());
        }
        connectionsByRoom.get(roomId)?.add(ws);
        connectionToUser.set(userId, ws);
        if (!userIdByRoom.get(roomId)) {
          userIdByRoom.set(roomId, new Set());
        }
        userIdByRoom.get(roomId)?.add(userId);
        userIdToRoomId.set(roomId, userId);
        userToConnection.set(ws, userId);

        console.log(`User ${userId} joined room ${roomId}`);
        console.log(
          "Current connections in room:",
          connectionsByRoom.get(roomId)?.size
        );

        // pending notifications on joining the user to show them
        if (pendingNotifications.has(userId)) {
          pendingNotifications
            .get(userId)
            ?.forEach((notifications) =>
              ws.send(
                JSON.stringify({ type: "notification", data: notifications })
              )
            );
        }

        break;
      // i think this is not needed
      // case "notifications":
      //   // 1. user related updates
      //   const userWs = connectionToUser.get(userId);
      //   if (userWs) {
      //     userWs.send(JSON.stringify({ type: "notification", data }));
      //   } else {
      //     // pending notifications
      //     // push into the queue
      //     if (!pendingNotifications.has(userId)) {
      //       pendingNotifications.set(userId, new Set());
      //     }
      //     pendingNotifications.get(userId)?.add(data);
      //   }

      //   // 2. post related updates
      //   // to all the users friend or in the room
      //   break;
      case "chat":
        // broadcast on the same web socket server
        // publish to the another web socket server
        break;
      default:
        console.log("Unknown message type:", type);
    }
  });
});

//
//
// initial calls
main();
conenctToRedis();
