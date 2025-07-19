'use client'

import { motion } from 'framer-motion'
import { Shield, Brain, Zap, Lock, Eye, Cpu, Users, Globe } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function Products() {
  const { t } = useLanguage()
  const products = [
    {
      icon: Shield,
      title: 'Avocado Shield',
      category: 'Endpoint Protection',
      description: 'Advanced endpoint security that protects devices from sophisticated threats using AI-powered detection.',
      features: ['Real-time threat detection', 'Behavioral analysis', 'Automated response', 'Cloud-based management'],
      price: 'Starting at $25/user/month'
    },
    {
      icon: Brain,
      title: 'Avocado AI Sentinel',
      category: 'AI Security Platform',
      description: 'Comprehensive AI-powered security platform that learns and adapts to new threats automatically.',
      features: ['Machine learning algorithms', 'Predictive analytics', 'Threat intelligence', 'Automated incident response'],
      price: 'Starting at $50/user/month'
    },
    {
      icon: Zap,
      title: 'Avocado Response',
      category: 'Incident Response',
      description: 'Rapid incident response and recovery solution with automated workflows and AI assistance.',
      features: ['Automated workflows', 'AI-powered analysis', 'Real-time alerts', 'Recovery automation'],
      price: 'Starting at $100/incident'
    },
    {
      icon: Lock,
      title: 'Avocado Zero Trust',
      category: 'Access Control',
      description: 'Zero trust security framework that verifies every user and device before granting access.',
      features: ['Identity verification', 'Continuous monitoring', 'Least privilege access', 'Multi-factor authentication'],
      price: 'Starting at $15/user/month'
    },
    {
      icon: Eye,
      title: 'Avocado Monitor',
      category: 'Network Monitoring',
      description: 'Comprehensive network monitoring and threat detection with real-time visibility and analytics.',
      features: ['Network traffic analysis', 'Anomaly detection', 'Threat hunting', 'Compliance reporting'],
      price: 'Starting at $200/month'
    },
    {
      icon: Cpu,
      title: 'Avocado Intelligence',
      category: 'Threat Intelligence',
      description: 'Advanced threat intelligence platform that provides real-time insights into emerging threats.',
      features: ['Global threat feeds', 'Risk assessment', 'Vulnerability scanning', 'Threat correlation'],
      price: 'Starting at $500/month'
    }
  ]

  const solutions = [
    {
      title: 'Enterprise Security Suite',
      description: 'Complete security solution for large enterprises with multiple locations and complex requirements.',
      features: ['Unified management console', 'Advanced analytics', 'Custom integrations', '24/7 support'],
      icon: Users
    },
    {
      title: 'Cloud Security Platform',
      description: 'Comprehensive cloud security solution for organizations migrating to or operating in the cloud.',
      features: ['Multi-cloud support', 'Container security', 'API protection', 'Compliance automation'],
      icon: Globe
    },
    {
      title: 'SMB Security Package',
      description: 'Affordable security solution designed specifically for small and medium-sized businesses.',
      features: ['Easy deployment', 'Managed services', 'Cost-effective', 'Quick setup'],
      icon: Shield
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cyber-600 to-avocado-700 text-white section-padding">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('products.hero.title')}
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {t('products.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('products.coreProducts.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('products.coreProducts.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="card hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <product.icon className="h-10 w-10 text-avocado-600" />
                  <span className="text-sm font-medium text-avocado-600 bg-avocado-50 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {product.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {product.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-avocado-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-lg font-semibold text-avocado-600">
                  {product.price}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('products.enterpriseSolutions.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('products.enterpriseSolutions.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 border border-gray-200"
              >
                <solution.icon className="h-12 w-12 text-avocado-600 mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {solution.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {solution.description}
                </p>
                <ul className="space-y-3">
                  {solution.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-avocado-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="section-padding bg-gradient-to-r from-avocado-600 to-cyber-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('products.pricingCTA.title')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('products.pricingCTA.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-avocado-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                {t('products.pricingCTA.requestDemo')}
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-avocado-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                {t('products.pricingCTA.contactSales')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 