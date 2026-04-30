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

export default async function Home() {
  const { data: themes, error } = await supabase
    .from("themes")
    .select("id, title, description, category, level")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#f7f8f6] px-6 py-10">
          <div className="mx-auto max-w-5xl">
            <p className="text-red-600">データ取得エラー: {error.message}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f8f6] px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <header className="mb-20 pt-12">
            <p className="mb-3 text-sm text-gray-600">
              デザイン学習を、作品として積み上げる
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              ログを作成
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-gray-700">
              毎日のアウトプットを投稿し、そのままポートフォリオにつながる学習サービスです。
            </p>
          </header>

          <section>
            <h2 className="mb-8 text-2xl font-bold text-gray-900">課題一覧</h2>

            {themes && themes.length > 0 ? (
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
              <div className="rounded-2xl bg-white p-10 text-center">
                <p className="font-bold">課題がまだ登録されていません</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}