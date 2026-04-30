import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function NotFound() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f8f6] px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-bold text-orange-500">404 Not Found</p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            ページが見つかりませんでした
          </h1>

          <p className="mt-5 text-sm leading-7 text-gray-600">
            アクセスしたページは削除されたか、URLが変更された可能性があります。
            課題一覧や投稿一覧から、CreateLogのコンテンツをご確認ください。
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-md bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600"
            >
              トップへ戻る
            </Link>

            <Link
              href="/themes"
              className="rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50"
            >
              課題一覧を見る
            </Link>

            <Link
              href="/posts"
              className="rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50"
            >
              投稿一覧を見る
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}