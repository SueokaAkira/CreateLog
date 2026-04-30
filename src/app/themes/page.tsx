export const dynamic = "force-dynamic";

import { ThemeCard } from "@/components/features/themes/ThemeCard";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { supabase } from "@/lib/supabase/client";

type Theme = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
};

export default async function ThemesPage() {
  const { data: themes, error } = await supabase
    .from("themes")
    .select("id, title, description, category, level")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f8f6] px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="mb-3 text-sm text-gray-600">Theme</p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              課題一覧
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-700">
              バナー、ロゴ、LP、UIなど、デザイン学習のアウトプットにつながる課題を選べます。
              まずは気になる課題を選び、制作意図と一緒に投稿してみましょう。
            </p>
          </div>

          {error ? (
            <div className="rounded-2xl bg-white p-8 text-red-600 shadow-sm">
              データ取得エラー: {error.message}
            </div>
          ) : themes && themes.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-3">
              {themes.map((theme: Theme) => (
                <ThemeCard
                key={theme.id}
                id={theme.id}
                title={theme.title}
                description={theme.description}
                category={theme.category}
                level={theme.level}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="font-bold text-gray-900">
                課題がまだ登録されていません
              </p>
              <p className="mt-3 text-sm text-gray-600">
                新しい課題が追加されるまでお待ちください。
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}