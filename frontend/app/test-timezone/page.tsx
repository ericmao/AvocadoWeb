'use client'

import { useState, useEffect } from 'react'

export default function TestTimezonePage() {
  const [testDate, setTestDate] = useState('2025-07-19')
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`])
  }

  const testTimezoneConversion = async () => {
    addLog('=== 開始時區轉換測試 ===')
    addLog(`測試日期: ${testDate}`)
    
    try {
      // 測試 API 調用
      const response = await fetch('/api/news/5', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '時區測試',
          content: '測試時區轉換',
          category: '測試',
          published_date: `${testDate}T00:00:00.000Z`,
          is_published: true
        }),
      })
      
      const result = await response.json()
      setApiResponse(result)
      addLog(`API 響應: ${JSON.stringify(result, null, 2)}`)
      
      // 檢查日期
      if (result.published_date) {
        const apiDate = new Date(result.published_date)
        const year = apiDate.getUTCFullYear()
        const month = String(apiDate.getUTCMonth() + 1).padStart(2, '0')
        const day = String(apiDate.getUTCDate()).padStart(2, '0')
        const formattedDate = `${year}-${month}-${day}`
        
        addLog(`API 返回的日期: ${result.published_date}`)
        addLog(`格式化後的日期: ${formattedDate}`)
        addLog(`原始測試日期: ${testDate}`)
        addLog(`日期是否匹配: ${formattedDate === testDate ? '✅ 是' : '❌ 否'}`)
      }
      
    } catch (error) {
      addLog(`錯誤: ${error}`)
    }
  }

  const clearLogs = () => {
    setLogs([])
    setApiResponse(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">時區測試頁面</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">測試設置</h2>
          <div className="flex items-center space-x-4 mb-4">
            <label className="text-sm font-medium text-gray-700">測試日期:</label>
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={testTimezoneConversion}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              測試時區轉換
            </button>
            <button
              onClick={clearLogs}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              清除日誌
            </button>
          </div>
        </div>

        {apiResponse && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">API 響應</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">測試日誌</h2>
          <div className="bg-gray-100 p-4 rounded-md max-h-96 overflow-auto">
            {logs.map((log, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 