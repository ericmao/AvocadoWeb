'use client'

import { useState, useEffect } from 'react'

export default function TestDatePage() {
  const [testDate, setTestDate] = useState('2024-04-15')
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`])
  }

  const testDateConversion = () => {
    addLog('=== 開始日期轉換測試 ===')
    addLog(`原始日期: ${testDate}`)
    
    // 測試轉換邏輯
    const formatDateForBackend = (dateString: string) => {
      addLog(`formatDateForBackend 輸入: ${dateString}`)
      if (!dateString) {
        addLog('沒有日期字串，使用當前日期')
        return new Date().toISOString()
      }
      if (dateString.includes('T')) {
        addLog('已經是 ISO 格式，直接返回')
        return dateString
      }
      const isoDate = new Date(dateString + 'T00:00:00').toISOString()
      addLog(`轉換為 ISO 格式: ${isoDate}`)
      return isoDate
    }

    const formattedDate = formatDateForBackend(testDate)
    addLog(`最終格式化日期: ${formattedDate}`)
    
    return formattedDate
  }

  const testApiCall = async () => {
    addLog('=== 開始 API 測試 ===')
    
    const formattedDate = testDateConversion()
    
    const testData = {
      title: '測試日期更新',
      content: '這是測試日期更新的內容',
      category: '測試',
      published_date: formattedDate,
      is_published: true
    }
    
    addLog(`發送到後端的數據: ${JSON.stringify(testData, null, 2)}`)
    
    try {
      const response = await fetch('/api/news/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      })
      
      if (response.ok) {
        const result = await response.json()
        addLog(`API 響應成功: ${JSON.stringify(result, null, 2)}`)
        setApiResponse(result)
      } else {
        const errorText = await response.text()
        addLog(`API 錯誤: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      addLog(`API 調用失敗: ${error}`)
    }
  }

  const testUpdateApiCall = async () => {
    if (!apiResponse?.id) {
      addLog('沒有可更新的新聞 ID')
      return
    }
    
    addLog('=== 開始更新 API 測試 ===')
    
    const formattedDate = testDateConversion()
    
    const updateData = {
      title: '更新後的測試日期',
      content: '這是更新後的測試內容',
      category: '更新測試',
      published_date: formattedDate,
      is_published: true
    }
    
    addLog(`更新數據: ${JSON.stringify(updateData, null, 2)}`)
    
    try {
      const response = await fetch(`/api/news/${apiResponse.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
      
      if (response.ok) {
        const result = await response.json()
        addLog(`更新成功: ${JSON.stringify(result, null, 2)}`)
        setApiResponse(result)
      } else {
        const errorText = await response.text()
        addLog(`更新錯誤: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      addLog(`更新調用失敗: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">日期處理測試</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">測試設置</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                測試日期
              </label>
              <input
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={testDateConversion}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                測試日期轉換
              </button>
              <button
                onClick={testApiCall}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                測試創建 API
              </button>
              <button
                onClick={testUpdateApiCall}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                測試更新 API
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API 響應</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {apiResponse ? JSON.stringify(apiResponse, null, 2) : '尚未有 API 響應'}
          </pre>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">測試日誌</h2>
          <div className="bg-gray-100 p-4 rounded text-sm max-h-96 overflow-auto">
            {logs.map((log, index) => (
              <div key={index} className="mb-1 font-mono text-xs">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 