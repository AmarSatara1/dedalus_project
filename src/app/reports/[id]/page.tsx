import Editor from '@/components/Editor'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ReportProvider } from '@/contexts/ReportContext'
import VerifyButton from '../../../components/VerifyButton'

interface ReportPageProps {
  params: Promise<{ id: string }>
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params
  
  const report = await prisma.report.findUnique({
    where: { id }
  })
  
  if (!report) {
    notFound()
  }
  
  return (
    <ReportProvider value={{
      patientName: report.patientName,
      patientAge: report.patientAge,
      reportId: report.id,
      content: report.content,
      isVerified: report.verified || false,
    }}>
      <div className="flex min-h-full flex-col items-center px-4 py-12">
        <div className="w-full max-w-3xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Report for {report.patientName}
            </h1>
            <VerifyButton reportId={report.id} isVerified={report.verified || false} />
          </div>
          <Editor />
        </div>
      </div>
    </ReportProvider>
  )
}