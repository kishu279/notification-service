import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border-2 border-blue-400 p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-blue-600 text-center mb-12">
            INSTA-TANIYA
          </h1>
          <p className="text-2xl">...</p>
        </div>
        <div>
          <p className="text-2xl">Go To Posts Section</p>
          <Link href={"/post"}>posts</Link>
        </div>
      </div>
    </main>
  );
}
