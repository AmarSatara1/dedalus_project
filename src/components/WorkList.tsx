import type { Report } from "@prisma/client";

export default function WorkList({ reports }: Readonly<{ reports: Report[] }>) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
      {}
    </div>
  );
}
