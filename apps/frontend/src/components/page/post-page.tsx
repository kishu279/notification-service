"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import PostForm from "../form/post-form";

const WS_URL = "ws://localhost:3020";

interface PostPageProps {
  userId: string;
  roomId: string;
}

export default function PostPage({ userId, roomId }: PostPageProps) {
  // persistent ws connection
  const [conn, setConn] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // make the connection to wss
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("WebSocket connection open");
      // send message to join the room
      ws.send(JSON.stringify({ type: "join", userId, roomId }));
      setConn(ws);
      setConnected(true);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setConn(null);
      setConnected(false);
    };

    ws.onmessage = (message) => {
      // parse the message
      const parsedData = JSON.parse(message.data);

      const { type, data } = parsedData;

      switch (type) {
        case "notification":
          // show the notification
          console.log("Notification received:", data);
          toast(data, { description: data });
          break;
        case "message":
          break;
      }
    };
  }, []);

  return (
    <div>
      <PostForm userId={userId} roomId={roomId} />
    </div>
  );
}
