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
      className="block rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="mb-4 h-40 w-full rounded-xl object-cover"
        />
      ) : (
        <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
          No Image
        </div>
      )}

      <div className="mb-3 flex flex-wrap gap-2">
        {category && (
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {category}
          </span>
        )}
        {tools && (
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
            {tools}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-gray-900">{title}</h3>

      {description && (
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
          {description}
        </p>
      )}

      {(displayName || username) && (
        <p className="mt-5 text-xs text-gray-500">
          by {displayName ?? username}
        </p>
      )}

      <p className="mt-4 text-sm font-bold text-orange-600">詳細を見る →</p>
    </Link>
  );
}