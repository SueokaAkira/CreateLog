import { PostCard } from "@/components/features/posts/PostCard";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { supabase } from "@/lib/supabase/client";

type PublicPost = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  tools: string | null;
  image_url: string | null;
  profiles:
    | {
        username: string;
        display_name: string;
      }[]
    | null;
};

export default async function PostsPage() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      description,
      category,
      tools,
      image_url,
      profiles (
        username,
        display_name
      )
    `
    )
    .eq("status", "public")
    .order("created_at", { ascending: false });

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f8f6] px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="mb-3 text-sm text-gray-600">Posts</p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              投稿一覧
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-700">
              公開された学習アウトプットを一覧で確認できます。制作意図や使用ツールを見ながら、自分の学習にも活かしていきましょう。
            </p>
          </div>

          {error ? (
            <div className="rounded-2xl bg-white p-8 text-red-600 shadow-sm">
              データ取得エラー: {error.message}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-3">
                {(posts as PublicPost[]).map((post) => (
                <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    description={post.description}
                    category={post.category}
                    tools={post.tools}
                    imageUrl={post.image_url}
                    displayName={post.profiles?.[0]?.display_name}
                    username={post.profiles?.[0]?.username}
                />
                ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="font-bold text-gray-900">
                公開投稿はまだありません
              </p>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                最初の投稿を作成すると、ここに表示されます。
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}