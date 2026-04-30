"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { supabase } from "@/lib/supabase/client";

function NewPostPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeId = searchParams.get("themeId");

  const [userId, setUserId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [concept, setConcept] = useState("");
  const [tools, setTools] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"public" | "private" | "draft">(
    "public"
  );
  const [copyrightConfirmed, setCopyrightConfirmed] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);
      setIsCheckingUser(false);
    };

    checkUser();
  }, [router]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setImagePreviewUrl(null);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setMessage("画像形式は jpg / png / webp のいずれかにしてください。");
      event.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      setMessage("画像サイズは5MB以内にしてください。");
      event.target.value = "";
      return;
    }

    setMessage("");
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imageFile || !userId) {
      return null;
    }

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(fileName, imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from("post-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!userId) {
      setMessage("ログイン情報を確認できませんでした。再度ログインしてください。");
      return;
    }

    if (!title.trim()) {
      setMessage("投稿タイトルを入力してください。");
      return;
    }

    if (!copyrightConfirmed) {
      setMessage("投稿前の確認事項にチェックしてください。");
      return;
    }

    setIsSaving(true);

    try {
      const imageUrl = await uploadImage();

      const { error } = await supabase.from("posts").insert({
        user_id: userId,
        theme_id: themeId,
        title,
        description,
        concept,
        tools,
        category,
        status,
        copyright_confirmed: copyrightConfirmed,
        image_url: imageUrl,
      });

      if (error) {
        setMessage(`保存エラー: ${error.message}`);
        setIsSaving(false);
        return;
      }

      setIsSaving(false);
      router.push("/mypage");
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "画像アップロードに失敗しました。";

      setMessage(`画像アップロードエラー: ${errorMessage}`);
      setIsSaving(false);
    }
  };

  if (isCheckingUser) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#f7f8f6] px-6 py-14">
          <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-600">ログイン状態を確認中...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f8f6] px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/themes"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← 課題一覧に戻る
          </Link>

          <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm md:p-12">
            <div className="mb-10">
              <p className="mb-3 text-sm text-gray-600">Post</p>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                投稿を作成
              </h1>
              <p className="mt-4 text-sm leading-7 text-gray-700">
                制作したアウトプットを記録しましょう。制作意図や使用ツールも一緒に残すことで、後から振り返りやすくなります。
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-900">
                  投稿タイトル
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="例：春のキャンペーンバナー"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-900">
                  作品画像
                </label>

                <div className="rounded-2xl border border-dashed border-gray-300 bg-[#f7f8f6] p-6">
                  {imagePreviewUrl ? (
                    <div>
                      <img
                        src={imagePreviewUrl}
                        alt="アップロード予定の画像"
                        className="max-h-80 w-full rounded-xl object-contain"
                      />
                      <p className="mt-4 text-xs text-gray-600">
                        別の画像に差し替える場合は、下のボタンから選択してください。
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-900">
                        画像をアップロード
                      </p>
                      <p className="mt-2 text-xs text-gray-600">
                        jpg / png / webp、5MBまで
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="mt-5 text-sm text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-900">
                  カテゴリ
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  placeholder="例：バナー / ロゴ / LP / UI"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-900">
                  説明文
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="制作物の概要を書いてください"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-7 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-900">
                  制作意図
                </label>
                <textarea
                  rows={5}
                  value={concept}
                  onChange={(event) => setConcept(event.target.value)}
                  placeholder="なぜこの構成・配色・表現にしたのかを書いてください"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-7 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-900">
                  使用ツール
                </label>
                <input
                  type="text"
                  value={tools}
                  onChange={(event) => setTools(event.target.value)}
                  placeholder="例：Figma / Photoshop / Illustrator"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-900">
                  公開設定
                </label>
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as "public" | "private" | "draft"
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-orange-400"
                >
                  <option value="public">公開</option>
                  <option value="private">非公開</option>
                  <option value="draft">下書き</option>
                </select>
              </div>

              <label className="flex gap-3 rounded-2xl bg-[#f7f8f6] p-4 text-sm leading-7 text-gray-700">
                <input
                  type="checkbox"
                  checked={copyrightConfirmed}
                  onChange={(event) =>
                    setCopyrightConfirmed(event.target.checked)
                  }
                  className="mt-1"
                />
                <span>
                  他者の作品を無断転載していないこと、投稿内容に問題がないことを確認しました。
                </span>
              </label>

              {message && (
                <p className="rounded-xl bg-[#f7f8f6] p-4 text-sm leading-7 text-red-600">
                  {message}
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-md bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60"
                >
                  {isSaving ? "保存中..." : "投稿を保存する"}
                </button>

                <Link
                  href="/themes"
                  className="rounded-md border border-gray-300 bg-white px-5 py-3 text-center text-sm font-bold text-gray-900 hover:bg-gray-50"
                >
                  キャンセル
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function NewPostPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <main className="min-h-screen bg-[#f7f8f6] px-6 py-14">
            <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-sm text-gray-600">読み込み中...</p>
            </div>
          </main>
          <Footer />
        </>
      }
    >
      <NewPostPageContent />
    </Suspense>
  );
}