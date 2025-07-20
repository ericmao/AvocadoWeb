'use client'

import { motion } from 'framer-motion'
import { Shield, Brain, Zap, Lock, Eye, Cpu, Network, Database, Target, Users, AlertTriangle, BarChart3, Activity } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useState, useEffect } from 'react'

interface Technique {
  id: number
  name: string
  description: string
  features: string[]
  category: string
  is_active: boolean
}

export default function Techniques() {
  const { t } = useLanguage()
  const [techniques, setTechniques] = useState<Technique[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Icon mapping
  const iconMap: { [key: string]: any } = {
    'AI/ML': Brain,
    'Edge AI': Network,
    'XDR/SIEM': Shield,
    'SOC/War Room': Users,
    'BAS/Simulation': Target,
    'default': Brain
  }

  useEffect(() => {
    const fetchTechniques = async () => {
      try {
        setLoading(true)
        console.log('Fetching techniques from:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/techniques/`)
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/techniques/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        console.log('Response status:', response.status)
        console.log('Response ok:', response.ok)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Response error:', errorText)
          throw new Error(`Failed to fetch techniques: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log('Fetched techniques:', data)
        setTechniques(data)
      } catch (err) {
        console.error('Error fetching techniques:', err)
        setError(err instanceof Error ? err.message : 'Failed to load techniques')
        // Fallback to default techniques if API fails
        console.log('Using fallback techniques')
        setTechniques([
          {
            id: 1,
            name: '1️⃣ AI-Powered Threat Detection & Behavioral Analytics',
            description: 'Leverage machine learning and behavioral models to detect evolving threats in real-time.',
            features: ['Pattern Recognition', 'Anomaly Detection', 'Predictive Attack Analysis', 'Machine Learning-Based Behavioral Profiling'],
            category: 'AI/ML',
            is_active: true
          },
          {
            id: 2,
            name: '2️⃣ Edge AI Agentic RAG Sequence Analysis Engine',
            description: 'Generic Edge AI Detection Engine for Suspicious Sequence Analysis. A software-hardware integrated solution deploying lightweight AI agents at the edge (Wi-Fi mesh, firewalls, CPE, IoT gateways) for continuous local detection.',
            features: ['Edge AI Inference on network devices', 'Encrypted Traffic Behavior Analysis', 'Local Blocking & Cloud Collaborative Response', 'Compatible with OpenWRT, prplOS, RDK-B, Containers', 'Agentic RAG: Retrieval-Augmented Generation with temporal and semantic memory for adaptive threat detection'],
            category: 'Edge AI',
            is_active: true
          },
          {
            id: 3,
            name: '3️⃣ AI-Augmented XDR, SIEM & SenseL Language Model for Threat Intelligence',
            description: 'Combine XDR and SIEM with AI SenseL LLM for enhanced threat intelligence, incident correlation, and response.',
            features: ['Threat Hunting & Incident Correlation', 'Vulnerability and Risk Assessment', 'Automated Report Generation with LLM', 'Kill Chain Mapping and Attack Contextualization'],
            category: 'XDR/SIEM',
            is_active: true
          },
          {
            id: 4,
            name: '4️⃣ AI-Driven War Room & Response Support Services',
            description: 'High-Level AI Security War Room with LLM Integration. Empower your SOC operations with an AI-powered war room for real-time decision support.',
            features: ['Real-Time Threat Visualization Dashboard', 'LLM-Assisted Response Playbook Recommendations', 'Digital Twin Incident Simulation & Response Training', 'Multilingual Threat Intelligence Analysis'],
            category: 'SOC/War Room',
            is_active: true
          },
          {
            id: 5,
            name: '5️⃣ AI-Enhanced Breach & Attack Simulation (BAS)',
            description: 'Transform cyber readiness exercises with AI-powered BAS to continuously validate detection and response capabilities.',
            features: ['Automated APT Simulation', 'IoT/OT Attack Scenarios', 'Hybrid Red & Blue Team Simulations', 'AI-Driven Scenario Generation & Adaptation'],
            category: 'BAS/Simulation',
            is_active: true
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTechniques()
  }, [])

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
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-avocado-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading techniques...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              techniques.map((technique, index) => {
                const IconComponent = iconMap[technique.category] || iconMap['default']
                return (
                  <motion.div
                    key={technique.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="card"
                  >
                    <IconComponent className="h-12 w-12 text-avocado-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {technique.name}
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
                )
              })
            )}
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