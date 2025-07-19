'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Brain, Zap, Users, TrendingUp, CheckCircle } from 'lucide-react'
import { useLanguage } from './contexts/LanguageContext'

export default function Home() {
  const { t } = useLanguage()
  const features = [
    {
      icon: Shield,
      title: t('home.features.advancedSecurity'),
      description: t('home.features.advancedSecurityDesc'),
    },
    {
      icon: Brain,
      title: t('home.features.aiIntelligence'),
      description: t('home.features.aiIntelligenceDesc'),
    },
    {
      icon: Zap,
      title: t('home.features.realTimeProtection'),
      description: t('home.features.realTimeProtectionDesc'),
    },
    {
      icon: Users,
      title: t('home.features.enterpriseSolutions'),
      description: t('home.features.enterpriseSolutionsDesc'),
    },
  ]

  const stats = [
    { number: '99.9%', label: t('home.stats.threatDetection') },
    { number: '24/7', label: t('home.stats.monitoring') },
    { number: '500+', label: t('home.stats.clients') },
    { number: '50M+', label: t('home.stats.threatsBlocked') },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-avocado-50 to-cyber-50 section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                {t('home.hero.title')}{' '}
                <span className="text-avocado-600">AI</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products" className="btn-primary text-center">
                  {t('home.hero.exploreProducts')}
                </Link>
                <Link href="/contact" className="btn-secondary text-center">
                  {t('home.hero.getStarted')}
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <Shield className="h-12 w-12 text-avocado-600" />
                  <Brain className="h-12 w-12 text-cyber-600" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-4">AI-Powered Security</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Real-time threat detection</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Machine learning algorithms</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Automated response systems</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="card text-center"
              >
                <feature.icon className="h-12 w-12 text-avocado-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('home.stats.title')}
            </h2>
            <p className="text-xl text-gray-300">
              {t('home.stats.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-avocado-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-avocado-600 to-cyber-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('home.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-white text-avocado-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                {t('home.cta.getStartedToday')}
              </Link>
              <Link href="/cases" className="border-2 border-white text-white hover:bg-white hover:text-avocado-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                {t('home.cta.viewCaseStudies')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 