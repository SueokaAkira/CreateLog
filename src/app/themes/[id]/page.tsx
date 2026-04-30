import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { supabase } from "@/lib/supabase/client";

type ThemeDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ThemeDetailPage({
  params,
}: ThemeDetailPageProps) {
  const { id } = await params;

  const { data: theme, error } = await supabase
    .from("themes")
    .select(
      "id, title, description, category, level, prompt, requirements, is_published"
    )
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (error || !theme) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f8f6] px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/themes"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← 課題一覧に戻る
          </Link>

          <article className="mt-8 rounded-3xl bg-white p-8 shadow-sm md:p-12">
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {theme.category}
              </span>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                {theme.level}
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {theme.title}
            </h1>

            <p className="mt-6 text-base leading-8 text-gray-700">
              {theme.description}
            </p>

            <div className="mt-10 rounded-2xl bg-[#f7f8f6] p-6">
              <h2 className="text-lg font-bold text-gray-900">制作課題</h2>
              <p className="mt-3 text-sm leading-7 text-gray-700">
                {theme.prompt}
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-[#f7f8f6] p-6">
              <h2 className="text-lg font-bold text-gray-900">
                提出時のポイント
              </h2>
              <p className="mt-3 text-sm leading-7 text-gray-700">
                {theme.requirements}
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/posts/new?themeId=${theme.id}`}
                className="rounded-md bg-orange-500 px-5 py-3 text-center text-sm font-bold text-white hover:bg-orange-600"
              >
                この課題で作る
              </Link>
              <Link
                href="/posts"
                className="rounded-md border border-gray-300 bg-white px-5 py-3 text-center text-sm font-bold text-gray-900 hover:bg-gray-50"
              >
                みんなの投稿を見る
              </Link>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}