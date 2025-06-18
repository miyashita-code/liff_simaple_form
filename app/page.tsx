'use client'

import { useEffect, useState } from 'react'
import liff from '@line/liff'

export default function Survey() {
  const [userId, setUserId] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [choice, setChoice] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile()
          setUserId(profile.userId)
          setUserName(profile.displayName)
        } else {
          liff.login()
        }
      } catch (error) {
        console.error('LIFF初期化エラー:', error)
      } finally {
        setIsLoading(false)
      }
    }
    initLiff()
  }, [])

  const handleSubmit = async () => {
    if (!choice || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userName, choice }),
      })

      if (response.ok) {
        await liff.sendMessages([
          {
            type: 'text',
            text: `アンケートに回答しました: ${choice}案`,
          },
        ])
        alert('回答ありがとうございました！')
        liff.closeWindow()
      } else {
        throw new Error('送信に失敗しました')
      }
    } catch (error) {
      console.error('送信エラー:', error)
      alert('送信中にエラーが発生しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-4">
        <h1 className="text-xl font-bold text-center mb-4 text-gray-800">
          3択アンケート
        </h1>
        
        <div className="space-y-4">
          <p className="text-gray-700 mb-4">
            以下の3つの選択肢から1つをお選びください：
          </p>
          
          {['A', 'B', 'C'].map((opt) => (
            <label
              key={opt}
              className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="radio"
                name="choice"
                value={opt}
                onChange={(e) => setChoice(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-lg">{opt}案</span>
            </label>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!choice || isSubmitting}
          className={`w-full mt-4 py-2.5 px-4 rounded-lg font-medium transition-colors ${
            !choice || isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? '送信中...' : '送信'}
        </button>

        {userName && (
          <div className="text-xs text-gray-500 text-center mt-4">
            <p>回答者: {userName}</p>
            <p className="text-xs">ID: {userId.substring(0, 8)}...</p>
          </div>
        )}
      </div>
    </main>
  )
}