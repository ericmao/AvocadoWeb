'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Calendar, Tag, ArrowRight, Newspaper, TrendingUp, Award } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface NewsItem {
  id: number
  title: string
  content: string
  category: string
  publishedDate: string
  isPublished: boolean
  images: string[]
}

export default function News() {
  const { t } = useLanguage()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news')
      const data = await response.json()
      
      // 統一的日期處理函數
      const formatDateForDisplay = (dateString: string) => {
        if (!dateString) return ''
        // 如果已經是 YYYY-MM-DD 格式，直接返回
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return dateString
        }
        // 如果是 ISO 格式，轉換為本地日期，避免時區偏移
        const date = new Date(dateString)
        // 使用 UTC 方法避免時區偏移
        const year = date.getUTCFullYear()
        const month = String(date.getUTCMonth() + 1).padStart(2, '0')
        const day = String(date.getUTCDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      
      // 轉換後端數據格式為前端期望的格式
      const transformedNews = data.map((news: any) => ({
        id: news.id,
        title: news.title,
        content: news.content,
        category: news.category,
        publishedDate: news.published_date ? formatDateForDisplay(news.published_date) : new Date().toISOString().split('T')[0],
        isPublished: news.is_published,
        images: news.images || []
      }))
      
      setNews(transformedNews)
    } catch (error) {
      console.error('Error fetching news:', error)
      // Fallback data
      setNews([
        {
          id: 1,
          title: 'Avocado.ai Launches New AI Security Platform',
          content: 'We are excited to announce the launch of our latest AI-powered security platform. This revolutionary solution combines cutting-edge machine learning algorithms with advanced threat detection capabilities to provide unprecedented protection for enterprise networks.',
          category: 'Product Launch',
          publishedDate: '2024-01-15',
          isPublished: true,
          images: []
        },
        {
          id: 2,
          title: 'Avocado.ai Recognized as Top Cybersecurity Company',
          content: 'Avocado.ai has been recognized as one of the top cybersecurity companies in 2024 by leading industry analysts. This recognition highlights our commitment to innovation and excellence in AI-powered security solutions.',
          category: 'Company News',
          publishedDate: '2024-01-10',
          isPublished: true,
          images: []
        },
        {
          id: 3,
          title: 'New Partnership with Global Tech Leaders',
          content: 'We are proud to announce strategic partnerships with leading technology companies to expand our global reach and enhance our security offerings. These partnerships will enable us to provide even more comprehensive protection for our clients.',
          category: 'Partnership',
          publishedDate: '2024-01-05',
          isPublished: true,
          images: []
        },
        {
          id: 4,
          title: 'AI Security Trends for 2024',
          content: 'As we enter 2024, we\'re seeing significant trends in AI-powered cybersecurity. Our research team has identified key developments that will shape the future of digital protection.',
          category: 'Industry Update',
          publishedDate: '2024-01-01',
          isPublished: true,
          images: []
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleReadMore = (newsItem: NewsItem) => {
    setSelectedNews(newsItem)
    setShowModal(true)
  }

  const categories = [
    { id: 'all', name: 'All News', icon: Newspaper },
    { id: 'Product Launch', name: 'Product Launch', icon: TrendingUp },
    { id: 'Company News', name: 'Company News', icon: Award },
    { id: 'Partnership', name: 'Partnership', icon: ArrowRight },
    { id: 'Industry Update', name: 'Industry Update', icon: Tag }
  ]

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-avocado-600 to-cyber-700 text-white section-padding">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('news.hero.title')}
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {t('news.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('news.categories.title')}
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-avocado-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <category.icon className="h-5 w-5" />
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-avocado-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading news...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* 顯示第一張圖片 */}
                  {item.images.length > 0 && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-avocado-100 text-avocado-800">
                        {item.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(item.publishedDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {item.content}
                    </p>
                    
                    <button 
                      onClick={() => handleReadMore(item)}
                      className="text-avocado-600 hover:text-avocado-700 font-medium flex items-center"
                    >
                      {t('news.readMore')}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {filteredNews.length === 0 && !loading && (
            <div className="text-center py-12">
              <Newspaper className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('news.noNews.title')}
              </h3>
              <p className="text-gray-600">
                {t('news.noNews.subtitle')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="section-padding bg-gradient-to-r from-avocado-600 to-cyber-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('news.newsletter.title')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('news.newsletter.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('news.newsletter.placeholder')}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
              />
              <button className="bg-white text-avocado-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                {t('news.newsletter.subscribe')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* News Detail Modal */}
      {showModal && selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-avocado-100 text-avocado-800">
                      {selectedNews.category}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(selectedNews.publishedDate).toLocaleDateString()}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedNews.title}
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Images Gallery */}
              {selectedNews.images.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">圖片集</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedNews.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`${selectedNews.title} - Image ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                            圖片 {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedNews.content}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{selectedNews.images.length} 張圖片</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-avocado-600 text-white rounded-lg hover:bg-avocado-700 transition-colors"
                >
                  關閉
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
} 