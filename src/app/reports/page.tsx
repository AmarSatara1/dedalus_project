import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function ReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
        Medical Reports
      </h1>
      
      {reports.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          No reports found. Create one using Prisma Studio.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Patient Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Age
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Updated
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700 bg-white dark:bg-zinc-900">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300 font-mono">
                    {report.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                    {report.patientName}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">
                    {report.patientAge || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">
                    {new Date(report.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {report.verified ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-300">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 text-xs font-medium text-yellow-700 dark:text-yellow-300">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link 
                      href={`/reports/${report.id}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Edit Report →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}