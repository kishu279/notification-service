import PostPage from "@/components/page/post-page";

export default function page() {
  const userId = "user@123";
  const roomId = "room@123";

  return (
    <div>
      <h1>Posts Page</h1>
      <p>hii taniya send your posts</p>
      <PostPage userId={userId} roomId={roomId} />
    </div>
  );
}
