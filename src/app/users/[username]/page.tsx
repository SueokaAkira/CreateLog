import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/features/posts/PostCard";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { supabase } from "@/lib/supabase/client";

type UserProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

type Profile = {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  website_url: string | null;
};

type PublicPost = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  tools: string | null;
  image_url: string | null;
};

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { username } = await params;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, avatar_url, website_url")
    .eq("username", username)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  const typedProfile = profile as Profile;

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("id, title, description, category, tools, image_url")
    .eq("user_id", typedProfile.id)
    .eq("status", "public")
    .order("created_at", { ascending: false });

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f8f6] px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/posts"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← 投稿一覧に戻る
          </Link>

          <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm md:p-12">
            <div className="grid gap-8 md:grid-cols-[220px_1fr] md:items-center">
              <div>
                {typedProfile.avatar_url ? (
                  <img
                    src={typedProfile.avatar_url}
                    alt={typedProfile.display_name}
                    className="h-32 w-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-orange-50 text-4xl font-bold text-orange-600">
                    {typedProfile.display_name.slice(0, 1)}
                  </div>
                )}
              </div>

              <div>
                <p className="mb-3 text-sm text-gray-600">Profile</p>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                  {typedProfile.display_name}
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  @{typedProfile.username}
                </p>

                {typedProfile.bio ? (
                  <p className="mt-6 max-w-2xl whitespace-pre-wrap text-sm leading-8 text-gray-700">
                    {typedProfile.bio}
                  </p>
                ) : (
                  <p className="mt-6 max-w-2xl text-sm leading-8 text-gray-500">
                    自己紹介はまだ登録されていません。
                  </p>
                )}

                {typedProfile.website_url && (
                  <a
                    href={typedProfile.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-block text-sm font-bold text-orange-600 hover:text-orange-700"
                  >
                    Webサイトを見る →
                  </a>
                )}
              </div>
            </div>
          </section>

          <section className="mt-10">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-3 text-sm text-gray-600">Works</p>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  公開投稿
                </h2>
                <p className="mt-3 text-sm leading-7 text-gray-700">
                  このユーザーが公開している学習アウトプットです。
                </p>
              </div>

              <Link
                href="/themes"
                className="rounded-md bg-orange-500 px-5 py-3 text-center text-sm font-bold text-white hover:bg-orange-600"
              >
                自分も課題を選ぶ
              </Link>
            </div>

            {postsError ? (
              <div className="rounded-2xl bg-white p-8 text-red-600 shadow-sm">
                投稿取得エラー: {postsError.message}
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
                    displayName={typedProfile.display_name}
                    username={typedProfile.username}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                <p className="font-bold text-gray-900">
                  公開投稿はまだありません
                </p>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  このユーザーが公開投稿を作成すると、ここに表示されます。
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}