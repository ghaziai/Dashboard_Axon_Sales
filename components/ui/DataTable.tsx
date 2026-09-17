export type Column<T> = {
  header: string;
  align?: "left" | "right";
  render: (row: T) => React.ReactNode;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
}) {
  if (rows.length === 0) {
    return <EmptyState message="Tidak ada data untuk ditampilkan." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-800">
            {columns.map((col) => (
              <th
                key={col.header}
                className={`whitespace-nowrap py-2 pr-4 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400 ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-b border-zinc-100 last:border-0 dark:border-zinc-900"
            >
              {columns.map((col) => (
                <td
                  key={col.header}
                  className={`whitespace-nowrap py-2 pr-4 text-zinc-700 dark:text-zinc-300 ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
      {message}
    </p>
  );
}
