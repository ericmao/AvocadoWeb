import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { LanguageProvider } from './contexts/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Avocado.ai - Cybersecurity & AI Solutions',
  description: 'Leading cybersecurity and AI company providing innovative solutions for enterprise security and artificial intelligence.',
  keywords: 'cybersecurity, AI, artificial intelligence, security solutions, enterprise security',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
} 