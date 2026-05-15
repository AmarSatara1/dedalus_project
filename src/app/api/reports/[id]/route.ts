import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { content } = body
    
    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        content: content,
        updatedAt: new Date(),
      },
    })
    
    return NextResponse.json({ 
      success: true, 
      savedAt: new Date().toISOString() 
    })
  } catch (error) {
    console.error('Failed to save report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save report' },
      { status: 500 }
    )
  }
}
