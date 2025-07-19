'use client'

import { motion } from 'framer-motion'
import { Shield, Brain, TrendingUp, Users, Globe, Building } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function Cases() {
  const { t } = useLanguage()
  const caseStudies = [
    {
      title: 'Fortune 500 Financial Institution',
      industry: 'Financial Services',
      challenge: 'Faced sophisticated cyber attacks targeting customer data and financial transactions.',
      solution: 'Implemented Avocado AI Sentinel with behavioral analytics and real-time threat detection.',
      results: [
        '99.9% threat detection rate',
        '60% reduction in false positives',
        'Real-time response to threats',
        'Compliance with financial regulations'
      ],
      icon: Building
    },
    {
      title: 'Global Healthcare Provider',
      industry: 'Healthcare',
      challenge: 'Needed to protect sensitive patient data while maintaining system accessibility for medical staff.',
      solution: 'Deployed Avocado Zero Trust framework with advanced access controls and monitoring.',
      results: [
        'Zero data breaches in 2 years',
        'HIPAA compliance achieved',
        'Improved system performance',
        'Enhanced user experience'
      ],
      icon: Shield
    },
    {
      title: 'E-commerce Platform',
      industry: 'Retail',
      challenge: 'Experienced frequent DDoS attacks and payment fraud attempts.',
      solution: 'Integrated Avocado Monitor with AI-powered fraud detection and automated response.',
      results: [
        '95% reduction in fraud attempts',
        '99.9% uptime maintained',
        'Automated threat response',
        'Improved customer trust'
      ],
      icon: Globe
    },
    {
      title: 'Technology Startup',
      industry: 'Technology',
      challenge: 'Rapid growth required scalable security solution without dedicated security team.',
      solution: 'Implemented Avocado Shield with managed security services and cloud-based management.',
      results: [
        '50% cost savings vs traditional solutions',
        '24/7 security monitoring',
        'Easy scalability',
        'Quick deployment'
      ],
      icon: Brain
    },
    {
      title: 'Government Agency',
      industry: 'Government',
      challenge: 'Required high-level security clearance and protection against nation-state attacks.',
      solution: 'Custom Avocado Intelligence platform with advanced threat hunting and intelligence sharing.',
      results: [
        'Top-level security clearance',
        'Advanced threat intelligence',
        'Inter-agency collaboration',
        'Comprehensive audit trails'
      ],
      icon: Shield
    },
    {
      title: 'Manufacturing Company',
      industry: 'Manufacturing',
      challenge: 'Industrial control systems vulnerable to cyber attacks affecting production.',
      solution: 'Deployed specialized IoT security with Avocado Response for incident management.',
      results: [
        'Protected critical infrastructure',
        'Zero production downtime',
        'Automated incident response',
        'Compliance with industry standards'
      ],
      icon: TrendingUp
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      title: 'CTO',
      company: 'Global Financial Corp',
      quote: 'Avocado.ai transformed our security posture. Their AI-powered solutions detected threats we didn\'t even know existed.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      title: 'Security Director',
      company: 'HealthTech Solutions',
      quote: 'The zero trust implementation was seamless and immediately improved our compliance and security.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      title: 'VP of Engineering',
      company: 'TechStart Inc',
      quote: 'Perfect solution for our growing startup. Scalable, cost-effective, and incredibly effective.',
      rating: 5
    }
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
              {t('cases.hero.title')}
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {t('cases.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('cases.caseStudies.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('cases.caseStudies.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-4">
                  <study.icon className="h-10 w-10 text-avocado-600" />
                  <span className="text-sm font-medium text-avocado-600 bg-avocado-50 px-3 py-1 rounded-full">
                    {study.industry}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {study.title}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Challenge:</h4>
                    <p className="text-gray-600 text-sm">{study.challenge}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Solution:</h4>
                    <p className="text-gray-600 text-sm">{study.solution}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Results:</h4>
                    <ul className="space-y-1">
                      {study.results.map((result) => (
                        <li key={result} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-avocado-500 rounded-full mr-3"></div>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('cases.testimonials.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('cases.testimonials.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.title}, {testimonial.company}</div>
                </div>
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
              Our Impact
            </h2>
            <p className="text-xl text-gray-300">
              The numbers speak for themselves
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Clients Protected' },
              { number: '99.9%', label: 'Success Rate' },
              { number: '50M+', label: 'Threats Blocked' },
              { number: '24/7', label: 'Support Available' }
            ].map((stat, index) => (
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
              Ready to Join Our Success Stories?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss how Avocado.ai can protect your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-avocado-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                Schedule a Demo
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-avocado-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 