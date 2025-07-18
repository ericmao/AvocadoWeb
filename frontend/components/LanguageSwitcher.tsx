'use client'

import { useLanguage } from '@/app/contexts/LanguageContext'
import { Globe } from 'lucide-react'

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en')
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-avocado-600 transition-colors duration-200"
    >
      <Globe className="h-4 w-4" />
      <span>{language === 'en' ? '中文' : 'English'}</span>
    </button>
  )
}

export default LanguageSwitcher 