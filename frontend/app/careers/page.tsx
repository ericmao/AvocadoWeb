'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Briefcase, MapPin, Clock, DollarSign, Users, GraduationCap, Zap } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface Job {
  id: number
  title: string
  department: string
  location: string
  type: string
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
  postedDate: string
}

export default function Careers() {
  const { t } = useLanguage()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch jobs from backend
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      const data = await response.json()
      setJobs(data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
      // Fallback data
      setJobs([
        {
          id: 1,
          title: 'AI Security Engineer',
          department: 'Engineering',
          location: 'Taipei',
          type: 'Full-time',
          salary: 'NT$ 80,000 - 120,000',
          description: 'Join our AI security team to develop cutting-edge cybersecurity solutions using machine learning and artificial intelligence.',
          requirements: [
            'Bachelor\'s degree in Computer Science or related field',
            '3+ years experience in cybersecurity',
            'Proficiency in Python, TensorFlow, PyTorch',
            'Experience with ML/AI algorithms',
            'Knowledge of network security protocols'
          ],
          benefits: [
            'Competitive salary and benefits',
            'Flexible work arrangements',
            'Professional development opportunities',
            'Health insurance coverage',
            'Stock options'
          ],
          postedDate: '2024-01-15'
        },
        {
          id: 2,
          title: 'Cybersecurity Analyst',
          department: 'Security Operations',
          location: 'Taipei',
          type: 'Full-time',
          salary: 'NT$ 60,000 - 90,000',
          description: 'Monitor and analyze security threats, implement security measures, and respond to incidents.',
          requirements: [
            'Bachelor\'s degree in Information Security or related field',
            '2+ years experience in security analysis',
            'Knowledge of SIEM tools and security frameworks',
            'Experience with threat hunting and incident response',
            'Certifications like CISSP, CEH preferred'
          ],
          benefits: [
            'Competitive salary and benefits',
            'Flexible work arrangements',
            'Professional development opportunities',
            'Health insurance coverage',
            'Stock options'
          ],
          postedDate: '2024-01-10'
        },
        {
          id: 3,
          title: 'Machine Learning Researcher',
          department: 'Research & Development',
          location: 'Taipei',
          type: 'Full-time',
          salary: 'NT$ 100,000 - 150,000',
          description: 'Research and develop advanced machine learning algorithms for cybersecurity applications.',
          requirements: [
            'PhD in Computer Science, Mathematics, or related field',
            'Strong background in machine learning and AI',
            'Experience with deep learning frameworks',
            'Published research in top conferences/journals',
            'Experience in cybersecurity domain preferred'
          ],
          benefits: [
            'Competitive salary and benefits',
            'Flexible work arrangements',
            'Professional development opportunities',
            'Health insurance coverage',
            'Stock options'
          ],
          postedDate: '2024-01-05'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

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
              {t('careers.hero.title')}
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {t('careers.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center justify-center space-x-2">
                <Users className="h-6 w-6" />
                <span>Join our growing team</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Zap className="h-6 w-6" />
                <span>Shape the future of AI security</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('careers.whyJoin.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('careers.whyJoin.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: GraduationCap,
                title: t('careers.whyJoin.learning.title'),
                description: t('careers.whyJoin.learning.description')
              },
              {
                icon: Users,
                title: t('careers.whyJoin.culture.title'),
                description: t('careers.whyJoin.culture.description')
              },
              {
                icon: Zap,
                title: t('careers.whyJoin.impact.title'),
                description: t('careers.whyJoin.impact.description')
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <item.icon className="h-12 w-12 text-avocado-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('careers.openPositions.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('careers.openPositions.subtitle')}
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-avocado-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading job opportunities...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <Briefcase className="h-6 w-6 text-avocado-600" />
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {job.title}
                          </h3>
                          <p className="text-gray-600">{job.department}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{job.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{job.salary}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{job.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                          <ul className="space-y-1">
                            {job.requirements.map((req, idx) => (
                              <li key={idx} className="flex items-center text-sm text-gray-600">
                                <div className="w-2 h-2 bg-avocado-500 rounded-full mr-3"></div>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
                          <ul className="space-y-1">
                            {job.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-center text-sm text-gray-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 lg:mt-0 lg:ml-6">
                      <p className="text-xs text-gray-500 mt-2">
                        Posted: {new Date(job.postedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
              {t('careers.cta.title')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('careers.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="bg-white text-avocado-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                {t('careers.cta.contactUs')}
              </a>
              <a href="mailto:hr@avocado.ai" className="border-2 border-white text-white hover:bg-white hover:text-avocado-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                {t('careers.cta.sendEmail')}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 