'use client'

import { motion } from 'framer-motion'
import { Shield, Brain, Zap, Lock, Eye, Cpu, Network, Database } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function Techniques() {
  const { t } = useLanguage()
  const techniques = [
    {
      icon: Brain,
      title: 'Machine Learning',
      description: 'Advanced ML algorithms that learn from patterns and adapt to new threats in real-time.',
      features: ['Pattern Recognition', 'Anomaly Detection', 'Predictive Analytics', 'Behavioral Analysis']
    },
    {
      icon: Shield,
      title: 'Threat Intelligence',
      description: 'Comprehensive threat intelligence gathering and analysis from global sources.',
      features: ['Real-time Monitoring', 'Threat Hunting', 'Vulnerability Assessment', 'Risk Analysis']
    },
    {
      icon: Zap,
      title: 'Automated Response',
      description: 'Intelligent automation that responds to threats faster than human operators.',
      features: ['Instant Blocking', 'Incident Response', 'Workflow Automation', 'Alert Management']
    },
    {
      icon: Lock,
      title: 'Zero Trust Security',
      description: 'Implementing zero trust principles across all network and application layers.',
      features: ['Identity Verification', 'Access Control', 'Network Segmentation', 'Continuous Monitoring']
    },
    {
      icon: Eye,
      title: 'Behavioral Analytics',
      description: 'Analyzing user and system behavior to detect suspicious activities.',
      features: ['User Behavior Analysis', 'System Monitoring', 'Risk Scoring', 'Threat Correlation']
    },
    {
      icon: Cpu,
      title: 'AI-Powered Detection',
      description: 'Next-generation AI systems that detect and prevent advanced persistent threats.',
      features: ['Deep Learning', 'Neural Networks', 'Natural Language Processing', 'Computer Vision']
    }
  ]

  const technologies = [
    { name: 'Python', category: 'Backend' },
    { name: 'TensorFlow', category: 'AI/ML' },
    { name: 'PyTorch', category: 'AI/ML' },
    { name: 'Kubernetes', category: 'Infrastructure' },
    { name: 'Docker', category: 'Infrastructure' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Redis', category: 'Cache' },
    { name: 'Elasticsearch', category: 'Search' },
    { name: 'Apache Kafka', category: 'Streaming' },
    { name: 'Prometheus', category: 'Monitoring' },
    { name: 'Grafana', category: 'Visualization' },
    { name: 'React', category: 'Frontend' }
  ]

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
              {t('techniques.hero.title')}
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {t('techniques.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Techniques Grid */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('techniques.coreTechnologies.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('techniques.coreTechnologies.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techniques.map((technique, index) => (
              <motion.div
                key={technique.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="card"
              >
                <technique.icon className="h-12 w-12 text-avocado-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {technique.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {technique.description}
                </p>
                <ul className="space-y-2">
                  {technique.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-600">
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

      {/* Technology Stack */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('techniques.technologyStack.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('techniques.technologyStack.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-gray-50 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {tech.name}
                </div>
                <div className="text-xs text-gray-500">
                  {tech.category}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('techniques.developmentProcess.title')}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('techniques.developmentProcess.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Research & Analysis', description: 'Deep analysis of security requirements and threat landscapes.' },
              { step: '02', title: 'AI Model Development', description: 'Building and training advanced AI models for threat detection.' },
              { step: '03', title: 'Integration & Testing', description: 'Comprehensive testing and integration with existing systems.' },
              { step: '04', title: 'Deployment & Monitoring', description: 'Secure deployment with continuous monitoring and updates.' }
            ].map((process, index) => (
              <motion.div
                key={process.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-avocado-400 mb-4">
                  {process.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {process.title}
                </h3>
                <p className="text-gray-300">
                  {process.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 