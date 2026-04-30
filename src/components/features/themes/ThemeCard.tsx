import Link from "next/link";

type ThemeCardProps = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
};

export function ThemeCard({
  id,
  title,
  description,
  category,
  level,
}: ThemeCardProps) {
  return (
    <Link
      href={`/themes/${id}`}
      className="block rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-4 h-32 rounded-xl bg-gray-100" />

      <div className="mb-3 flex gap-2">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {category}
        </span>
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
          {level}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>

      <p className="mt-5 text-sm font-bold text-orange-600">詳細を見る →</p>
    </Link>
  );
}