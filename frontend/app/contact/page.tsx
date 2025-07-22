'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function Contact() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    interest: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: Mail,
      title: t('contact.contactInfo.email'),
      details: 'rain@avocadolab.ai',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: t('contact.contactInfo.phone'),
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 6pm'
    },
    {
      icon: MapPin,
      title: t('contact.contactInfo.office'),
      details: 'San Francisco, CA',
      description: 'Visit our headquarters'
    },
    {
      icon: Clock,
      title: t('contact.contactInfo.support'),
      details: '24/7 Available',
      description: 'Round-the-clock assistance'
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
              {t('contact.hero.title')}
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {t('contact.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('contact.form.title')}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.fullName')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                      placeholder="your.email@company.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.company')}
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.interest')} *
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  >
                    <option value="">{t('contact.form.selectOption')}</option>
                    <option value="demo">{t('contact.form.demo')}</option>
                    <option value="pricing">{t('contact.form.pricing')}</option>
                    <option value="partnership">{t('contact.form.partnership')}</option>
                    <option value="support">{t('contact.form.support')}</option>
                    <option value="other">{t('contact.form.other')}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.message')} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                    placeholder="Tell us about your security needs..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary text-lg py-4"
                >
                  {t('contact.form.sendMessage')}
                </button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('contact.contactInfo.title')}
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0">
                      <info.icon className="h-6 w-6 text-avocado-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {info.title}
                      </h3>
                      <p className="text-gray-600 font-medium">
                        {info.details}
                      </p>
                      <p className="text-sm text-gray-500">
                        {info.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Office Hours */}
              <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('contact.officeHours.title')}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>{t('contact.officeHours.monday')}</span>
                    <span>{t('contact.officeHours.mondayHours')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('contact.officeHours.saturday')}</span>
                    <span>{t('contact.officeHours.saturdayHours')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('contact.officeHours.sunday')}</span>
                    <span>{t('contact.officeHours.sundayClosed')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('contact.faq.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('contact.faq.subtitle')}
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: t('contact.faq.question1'),
                answer: t('contact.faq.answer1')
              },
              {
                question: t('contact.faq.question2'),
                answer: t('contact.faq.answer2')
              },
              {
                question: t('contact.faq.question3'),
                answer: t('contact.faq.answer3')
              },
              {
                question: t('contact.faq.question4'),
                answer: t('contact.faq.answer4')
              }
            ].map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
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
              {t('contact.cta.title')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('contact.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-avocado-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                {t('contact.cta.scheduleDemo')}
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-avocado-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                {t('contact.cta.downloadBrochure')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 