'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Briefcase, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X
} from 'lucide-react'

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
  isActive: boolean
}

interface News {
  id: number
  title: string
  content: string
  category: string
  publishedDate: string
  isPublished: boolean
}

interface Case {
  id: number
  title: string
  industry: string
  challenge: string
  solution: string
  results: string[]
  isActive: boolean
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('jobs')
  const [jobs, setJobs] = useState<Job[]>([])
  const [news, setNews] = useState<News[]>([])
  const [cases, setCases] = useState<Case[]>([])
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [editingCase, setEditingCase] = useState<Case | null>(null)

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('admin_token')
    if (token) {
      setIsAuthenticated(true)
      fetchData()
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simple authentication (in production, use proper JWT)
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('admin_token', 'admin_token_123')
      setIsAuthenticated(true)
      fetchData()
    } else {
      alert('Invalid credentials')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
  }

  const fetchData = async () => {
    // Fetch jobs, news, and cases from backend
    try {
      const [jobsRes, newsRes, casesRes] = await Promise.all([
        fetch('http://localhost:8000/api/jobs'),
        fetch('http://localhost:8000/api/news'),
        fetch('http://localhost:8000/api/cases')
      ])
      
      const jobsData = await jobsRes.json()
      const newsData = await newsRes.json()
      const casesData = await casesRes.json()
      
      setJobs(jobsData)
      setNews(newsData)
      setCases(casesData)
    } catch (error) {
      console.error('Error fetching data:', error)
      // Set fallback data
      setJobs([
        {
          id: 1,
          title: 'AI Security Engineer',
          department: 'Engineering',
          location: 'Taipei',
          type: 'Full-time',
          salary: 'NT$ 80,000 - 120,000',
          description: 'Join our AI security team...',
          requirements: ['Bachelor\'s degree...'],
          benefits: ['Competitive salary...'],
          postedDate: '2024-01-15',
          isActive: true
        }
      ])
      setNews([
        {
          id: 1,
          title: 'Avocado.ai Launches New AI Security Platform',
          content: 'We are excited to announce...',
          category: 'Product Launch',
          publishedDate: '2024-01-15',
          isPublished: true
        }
      ])
      setCases([
        {
          id: 1,
          title: 'Fortune 500 Financial Institution',
          industry: 'Financial Services',
          challenge: 'Faced sophisticated cyber attacks...',
          solution: 'Implemented Avocado AI Sentinel...',
          results: ['99.9% threat detection rate'],
          isActive: true
        }
      ])
    }
  }

  const handleSaveJob = async (job: Job) => {
    try {
      const response = await fetch(`http://localhost:8000/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
      })
      if (response.ok) {
        setJobs(jobs.map(j => j.id === job.id ? job : j))
        setEditingJob(null)
      }
    } catch (error) {
      console.error('Error saving job:', error)
    }
  }

  const handleDeleteJob = async (jobId: number) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        await fetch(`http://localhost:8000/api/jobs/${jobId}`, {
          method: 'DELETE'
        })
        setJobs(jobs.filter(j => j.id !== jobId))
      } catch (error) {
        console.error('Error deleting job:', error)
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        >
          <div className="text-center mb-6">
            <Shield className="h-12 w-12 text-avocado-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600">Enter your credentials to access the admin panel</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-avocado-600 text-white py-2 px-4 rounded-md hover:bg-avocado-700 transition-colors"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-avocado-600" />
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-8">
          {[
            { id: 'jobs', label: 'Jobs', icon: Briefcase },
            { id: 'news', label: 'News', icon: FileText },
            { id: 'cases', label: 'Cases', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-avocado-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'jobs' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Job Management</h2>
                <button className="btn-primary flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Add Job</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-gray-600">{job.department} • {job.location}</p>
                        <p className="text-sm text-gray-500 mt-1">{job.salary}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingJob(job)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">News Management</h2>
                <button className="btn-primary flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Add News</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {news.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600">{item.category}</p>
                        <p className="text-sm text-gray-500 mt-1">{item.publishedDate}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cases' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Case Studies Management</h2>
                <button className="btn-primary flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Add Case</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {cases.map((caseStudy) => (
                  <div key={caseStudy.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{caseStudy.title}</h3>
                        <p className="text-gray-600">{caseStudy.industry}</p>
                        <p className="text-sm text-gray-500 mt-1">{caseStudy.challenge.substring(0, 100)}...</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Account</h3>
                  <p className="text-gray-600">Username: admin</p>
                  <button className="mt-2 text-blue-600 hover:text-blue-700">
                    Change Password
                  </button>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">System Information</h3>
                  <p className="text-gray-600">Version: 1.0.0</p>
                  <p className="text-gray-600">Last updated: 2024-01-15</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 