import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { supabase } from "@/lib/supabase/client";

type PostDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type PostDetail = {
  id: string;
  title: string;
  description: string | null;
  concept: string | null;
  tools: string | null;
  category: string | null;
  image_url: string | null;
  status: string;
  created_at: string;
  profiles:
    | {
        username: string;
        display_name: string;
      }[]
    | null;
  themes:
    | {
        title: string;
        category: string;
        level: string;
      }[]
    | null;
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      description,
      concept,
      tools,
      category,
      image_url,
      status,
      created_at,
      profiles (
        username,
        display_name
      ),
      themes (
        title,
        category,
        level
      )
    `
    )
    .eq("id", id)
    .eq("status", "public")
    .single();

  if (error || !data) {
    notFound();
  }

  const post = data as PostDetail;
  const profile = post.profiles?.[0];
  const theme = post.themes?.[0];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f8f6] px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/posts"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← 投稿一覧に戻る
          </Link>

          <article className="mt-8 rounded-3xl bg-white p-8 shadow-sm md:p-12">
            {post.image_url ? (
              <img
                src={post.image_url}
                alt={post.title}
                className="mb-8 h-auto w-full rounded-2xl object-cover"
              />
            ) : (
              <div className="mb-8 flex h-72 items-center justify-center rounded-2xl bg-gray-100 text-sm text-gray-400">
                No Image
              </div>
            )}

            <div className="mb-5 flex flex-wrap gap-2">
              {post.category && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {post.category}
                </span>
              )}

              {post.tools && (
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                  {post.tools}
                </span>
              )}

              {theme && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  課題：{theme.title}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {post.title}
            </h1>

            {profile && (
              <p className="mt-4 text-sm text-gray-600">
                by{" "}
                <Link
                  href={`/users/${profile.username}`}
                  className="font-bold text-orange-600 hover:text-orange-700"
                >
                  {profile.display_name}
                </Link>
              </p>
            )}

            {post.description && (
              <section className="mt-10">
                <h2 className="text-xl font-bold text-gray-900">説明文</h2>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-8 text-gray-700">
                  {post.description}
                </p>
              </section>
            )}

            {post.concept && (
              <section className="mt-10 rounded-2xl bg-[#f7f8f6] p-6">
                <h2 className="text-xl font-bold text-gray-900">制作意図</h2>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-8 text-gray-700">
                  {post.concept}
                </p>
              </section>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/themes"
                className="rounded-md bg-orange-500 px-5 py-3 text-center text-sm font-bold text-white hover:bg-orange-600"
              >
                別の課題を見る
              </Link>
              <Link
                href="/posts"
                className="rounded-md border border-gray-300 bg-white px-5 py-3 text-center text-sm font-bold text-gray-900 hover:bg-gray-50"
              >
                投稿一覧に戻る
              </Link>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}