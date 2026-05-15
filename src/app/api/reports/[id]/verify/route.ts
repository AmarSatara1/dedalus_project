import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    console.log('Verifying report:', id);
    
    const verifiedReport = await prisma.report.update({
      where: { id },
      data: {
        verified: true,
      },
    })
    
    console.log('Report verified successfully:', verifiedReport.id);
    
    return NextResponse.json({ 
      success: true, 
      report: verifiedReport 
    })
  } catch (error) {
    console.error('Failed to verify report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify report' },
      { status: 500 }
    )
  }
}
