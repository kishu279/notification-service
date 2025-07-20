"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

export default function PostForm({
  userId,
  roomId,
}: {
  userId: string;
  roomId: string;
}) {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    console.log("UserId:", userId);

    try {
      const response = await fetch("http://localhost:3010/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          content: formData.get("message"),
          contentType: "text",
        }),
      }).then((res) => res.json());

      if (response.success) {
        toast("Posting...", { description: "posting your post takes time" });
      }
    } catch (err) {
      console.error("Error ", err);
      toast("Error...", { description: "something went wrong" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <input
          type="text"
          name="message"
          placeholder="MESSAGE...."
          className="w-full px-4 py-3 border-2 border-blue-400 rounded-2xl text-blue-600 placeholder-blue-400 focus:outline-none focus:border-blue-600 text-center"
          required
        />
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="px-8 py-3 bg-white border-2 border-blue-400 text-blue-600 font-semibold rounded-2xl hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors"
        >
          SEND
        </button>
      </div>
    </form>
  );
}
