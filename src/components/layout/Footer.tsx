export function Footer() {
  return (
    <footer className="bg-[#f7f8f6] px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xl font-bold text-gray-900">CreateLog</p>
          <p className="mt-3 text-sm text-gray-600">
            学習を習慣化し、アウトプットを資産にするためのサービス
          </p>
          <div className="mt-6 flex gap-4 text-sm text-gray-700">
            <a href="/terms">利用規約</a>
            <a href="/privacy">プライバシーポリシー</a>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <a href="/themes">課題一覧</a>
          <a href="/posts">投稿一覧</a>
          <a href="/about">このサービスについて</a>
          <a href="/contact">お問合せ</a>
        </div>

        <p className="text-sm text-gray-600">© 2026 CreateLog</p>
      </div>
    </footer>
  );
}