import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('API route called: /api/cases/')
    
    const response = await fetch('http://backend:8000/api/cases/', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    console.log('Backend response status:', response.status)
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Backend data:', data)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying to backend:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data from backend' },
      { status: 500 }
    )
  }
} 