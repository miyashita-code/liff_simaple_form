import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, userName, choice } = body

    if (!userId || !choice) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    // Google Apps Script Web Appに転送
    const webhookUrl = process.env.APPSCRIPT_URL
    if (!webhookUrl) {
      console.error('APPSCRIPT_URLが設定されていません')
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      )
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        userName: userName || '不明',
        choice,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`Apps Script returned ${response.status}`)
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json(
      { error: '送信中にエラーが発生しました' },
      { status: 500 }
    )
  }
}