export function OrderStatusBadge({ status }: { status: string }) {
  let colorClass = "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300";

  switch (status.toLowerCase()) {
    case "shipped":
    case "resolved":
      colorClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      break;
    case "cancelled":
      colorClass = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      break;
    case "on hold":
      colorClass = "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      break;
    case "in process":
      colorClass = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      break;
    case "disputed":
      colorClass = "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      break;
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
}
