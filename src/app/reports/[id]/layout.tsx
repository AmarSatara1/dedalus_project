import Link from "next/link";
import Sidebar, { SidebarToggle } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/SidebarProvider";
import { ReportProvider } from "@/contexts/ReportContext";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface ReportLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ReportLayout({
  children,
  params,
}: ReportLayoutProps) {
  const { id } = await params;
  
  const report = await prisma.report.findUnique({
    where: { id }
  });
  
  if (!report) {
    notFound();
  }
  
  return (
    <ReportProvider value={{
      patientName: report.patientName,
      patientAge: report.patientAge,
      reportId: report.id,
      content: report.content,
      isVerified: report.verified || false,
    }}>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900">
              <SidebarToggle />
              <Link
                href="/reports"
                className="rounded-lg border border-zinc-300 px-3 py-1 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Back to worklist
              </Link>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </ReportProvider>
  );
}