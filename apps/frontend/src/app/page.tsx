import PostForm from "@/components/form/post-form";
import { FormEvent } from "react";

export default function Home() {

  return (
    <section className="">
      <div>
        <h1>INSTA-TANIYA</h1>
        {/* form */}
        <PostForm />
      </div>
    </section>
  );
}
