"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
      <h2 className="text-sm font-semibold text-red-900 dark:text-red-200">
        Gagal memuat data dasbor
      </h2>
      <p className="text-sm text-red-700 dark:text-red-300">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-red-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-800 dark:bg-red-200 dark:text-red-950 dark:hover:bg-red-300"
      >
        Coba lagi
      </button>
    </div>
  );
}
