import Link from "next/link";

type PostCardProps = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  tools: string | null;
  imageUrl: string | null;
  displayName?: string | null;
  username?: string | null;
};

export function PostCard({
  id,
  title,
  description,
  category,
  tools,
  imageUrl,
  displayName,
  username,
}: PostCardProps) {
  return (
    <Link
      href={`/posts/${id}`}
      className="group block overflow-hidden rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="overflow-hidden rounded-2xl bg-[#f7f8f6]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
            <div className="text-center">
              <p className="text-sm font-bold text-orange-500">CreateLog</p>
              <p className="mt-1 text-xs text-gray-500">No Image</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5">
        <div className="mb-4 flex flex-wrap gap-2">
          {category && (
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
              {category}
            </span>
          )}

          {tools && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
              {tools}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold leading-7 text-gray-900">
          {title}
        </h3>

        {description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-600">
            {description}
          </p>
        ) : (
          <p className="mt-3 text-sm leading-7 text-gray-400">
            説明文はまだ登録されていません。
          </p>
        )}

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
          {(displayName || username) && (
            <p className="min-w-0 truncate text-xs font-medium text-gray-500">
              by {displayName ?? username}
            </p>
          )}

          <p className="shrink-0 text-sm font-bold text-orange-500 transition group-hover:text-orange-600">
            詳細を見る →
          </p>
        </div>
      </div>
    </Link>
  );
}