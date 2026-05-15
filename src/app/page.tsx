import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Report Editor
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Welcome to the technical interview project. Edit structured reports
          using a rich text editor powered by TipTap.
        </p>
        <Link
          href="/reports"
          className="mt-8 inline-block rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Go to Reports
        </Link>
        <p className="mt-12 text-xs text-zinc-400 dark:text-zinc-600">
          Technical Interview Project
        </p>
      </div>
    </div>
  );
}
