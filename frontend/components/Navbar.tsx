'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X, Shield, Brain } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.techniques'), href: '/techniques' },
    { name: t('nav.products'), href: '/products' },
    { name: t('nav.cases'), href: '/cases' },
    { name: t('nav.contact'), href: '/contact' },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-avocado-600" />
              <Brain className="h-8 w-8 text-cyber-600" />
              <span className="text-xl font-bold text-gray-900">Avocado.ai</span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-avocado-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            <LanguageSwitcher />
            <button className="btn-primary">
              {t('nav.getStarted')}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-avocado-600 focus:outline-none focus:text-avocado-600"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-avocado-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <button className="btn-primary w-full mt-4">
              Get Started
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar 