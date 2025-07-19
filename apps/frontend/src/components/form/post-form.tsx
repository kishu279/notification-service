"use client";

import Form from "next/form";
import { FormEvent } from "react";
import { toast } from "sonner";

export default function PostForm() {
  // on submit event
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("http://localhost:3010/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user123",
          content: formData.get("query"),
          contentType: "text",
        }),
      }).then((res) => res.json());

      // toast on successfull
      if (response.success) {
        toast("Posting...", { description: "posting you'r post takes time" });
        // e.currentTarget.reset();
      }
    } catch (err) {
      console.error("Error ", err);
      toast("Error...", { description: "something went wrong" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="query" placeholder="Search..." />
      <button type="submit">submit</button>
    </form>
  );
}
