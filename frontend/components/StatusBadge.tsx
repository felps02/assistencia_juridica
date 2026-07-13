import { clsx } from "clsx";
import { labelFor, statusOptions } from "@/lib/options";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "NEW" && "bg-blue-50 text-blue-700",
        status === "UNDER_REVIEW" && "bg-amber-50 text-amber-700",
        status === "IN_PROGRESS" && "bg-indigo-50 text-indigo-700",
        status === "COMPLETED" && "bg-emerald-50 text-emerald-700",
        status === "CANCELLED" && "bg-red-50 text-red-700",
        status === "WAITING_CLIENT" && "bg-slate-100 text-slate-700"
      )}
    >
      {labelFor(statusOptions, status)}
    </span>
  );
}

