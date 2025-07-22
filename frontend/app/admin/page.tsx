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
  X,
  Zap,
  Package
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
  tags: string[]
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
  images: string[]
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

interface Technique {
  id: number
  name: string
  category: string
  description: string
  features: string[]
  isActive: boolean
}

interface Product {
  id: number
  name: string
  category: string
  description: string
  features: string[]
  price: string
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
  const [techniques, setTechniques] = useState<Technique[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [editingCase, setEditingCase] = useState<Case | null>(null)
  const [editingTechnique, setEditingTechnique] = useState<Technique | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAddNewsModal, setShowAddNewsModal] = useState(false)
  const [showAddJobModal, setShowAddJobModal] = useState(false)
  const [showAddCaseModal, setShowAddCaseModal] = useState(false)
  const [showAddTechniqueModal, setShowAddTechniqueModal] = useState(false)
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [newJob, setNewJob] = useState<Omit<Job, 'id'>>({
    title: '',
    department: '',
    location: '',
    type: '',
    salary: '',
    description: '',
    requirements: [],
    benefits: [],
    tags: [],
    postedDate: new Date().toISOString().split('T')[0],
    isActive: true
  })
  const [newCase, setNewCase] = useState<Omit<Case, 'id'>>({
    title: '',
    industry: '',
    challenge: '',
    solution: '',
    results: [],
    isActive: true
  })
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [newNews, setNewNews] = useState<Omit<News, 'id'>>({
    title: '',
    content: '',
    category: '',
    publishedDate: new Date().toISOString().split('T')[0],
    isPublished: true,
    images: []
  })
  const [newTechnique, setNewTechnique] = useState<Omit<Technique, 'id'>>({
    name: '',
    category: '',
    description: '',
    features: [],
    isActive: true
  })
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    category: '',
    description: '',
    features: [],
    price: '',
    isActive: true
  })

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
    try {
      const [jobsResponse, newsResponse, casesResponse, techniquesResponse, productsResponse, tagsResponse] = await Promise.all([
        fetch('/api/jobs/'),
        fetch('/api/news/admin/all'), // 使用新的端點獲取所有新聞
        fetch('/api/cases'),
        fetch('/api/techniques/'),
        fetch('/api/products/'),
        fetch('/api/jobs/tags')
      ])
      
      const jobsData = await jobsResponse.json()
      const newsData = await newsResponse.json()
      const casesData = await casesResponse.json()
      const techniquesData = await techniquesResponse.json()
      const productsData = await productsResponse.json()
      const tagsData = await tagsResponse.json()
      
      // Transform the data to match the expected format
      const transformedJobs = jobsData.map((job: any) => ({
        id: job.id,
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type,
        salary: job.salary,
        description: job.description,
        requirements: typeof job.requirements === 'string' ? JSON.parse(job.requirements) : job.requirements,
        benefits: typeof job.benefits === 'string' ? JSON.parse(job.benefits) : job.benefits,
        tags: typeof job.tags === 'string' ? JSON.parse(job.tags) : job.tags,
        postedDate: job.posted_date || new Date().toISOString().split('T')[0],
        isActive: job.is_active
      }))
      
      const transformedNews = newsData.map((news: any) => ({
        id: news.id,
        title: news.title,
        content: news.content,
        category: news.category,
        publishedDate: news.published_date ? formatDateForDisplay(news.published_date) : new Date().toISOString().split('T')[0],
        isPublished: news.is_published,
        images: news.images || []
      }))
      
      const transformedCases = casesData.map((caseStudy: any) => {
        console.log('Raw case from backend:', caseStudy)
        const transformed = {
          id: caseStudy.id,
          title: caseStudy.title,
          industry: caseStudy.industry,
          challenge: caseStudy.challenge,
          solution: caseStudy.solution,
          results: Array.isArray(caseStudy.results) ? caseStudy.results : 
                   typeof caseStudy.results === 'string' ? JSON.parse(caseStudy.results) : 
                   caseStudy.results || [],
          isActive: caseStudy.is_active
        }
        console.log('Transformed case:', transformed)
        return transformed
      })
      
      const transformedTechniques = techniquesData.map((technique: any) => ({
        id: technique.id,
        name: technique.name,
        category: technique.category,
        description: technique.description,
        features: Array.isArray(technique.features) ? technique.features : 
                 typeof technique.features === 'string' ? JSON.parse(technique.features) : 
                 technique.features || [],
        isActive: technique.is_active
      }))
      
      const transformedProducts = productsData.map((product: any) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        features: Array.isArray(product.features) ? product.features : 
                 typeof product.features === 'string' ? JSON.parse(product.features) : 
                 product.features || [],
        price: product.price,
        isActive: product.is_active
      }))
      
      setJobs(transformedJobs)
      setNews(transformedNews)
      setCases(transformedCases)
      setTechniques(transformedTechniques)
      setProducts(transformedProducts)
      setAvailableTags(tagsData)
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
          tags: ['AI', 'Security'],
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
          isPublished: true,
          images: []
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
      setAvailableTags(['AI', 'Security', 'Cybersecurity', 'Machine Learning'])
    }
  }

  const handleSaveJob = async (job: Job) => {
    try {
      // 轉換數據格式以匹配後端期望
      const jobData = {
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type,
        salary: job.salary,
        description: job.description,
        requirements: job.requirements,
        benefits: job.benefits,
        tags: job.tags
      }
      
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      })
      
      if (response.ok) {
        const updatedJob = await response.json()
        // 轉換後端返回的數據格式以匹配前端期望
        const formattedJob = {
          ...updatedJob,
          postedDate: updatedJob.posted_date ? new Date(updatedJob.posted_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          isActive: updatedJob.is_active
        }
        setJobs(jobs.map(j => j.id === job.id ? formattedJob : j))
        setEditingJob(null)
      } else {
        console.error('Failed to update job')
        const errorData = await response.text()
        console.error('Error response:', errorData)
      }
    } catch (error) {
      console.error('Error updating job:', error)
    }
  }

  const handleAddJob = async (job: Job) => {
    try {
      // 轉換數據格式以匹配後端期望
      const jobData = {
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type,
        salary: job.salary,
        description: job.description,
        requirements: job.requirements,
        benefits: job.benefits,
        tags: job.tags
      }
      
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      })
      
      if (response.ok) {
        const addedJob = await response.json()
        // 轉換後端返回的數據格式以匹配前端期望
        const formattedJob = {
          ...addedJob,
          postedDate: addedJob.posted_date ? new Date(addedJob.posted_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          isActive: addedJob.is_active
        }
        setJobs([...jobs, formattedJob])
        setShowAddJobModal(false)
        setNewJob({
          id: 0,
          title: '',
          department: '',
          location: '',
          type: '',
          salary: '',
          description: '',
          requirements: [],
          benefits: [],
          tags: [],
          postedDate: new Date().toISOString().split('T')[0],
          isActive: true
        })
      } else {
        console.error('Failed to add job')
        const errorData = await response.text()
        console.error('Error response:', errorData)
      }
    } catch (error) {
      console.error('Error adding job:', error)
    }
  }

  const handleDeleteJob = async (jobId: number) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        const response = await fetch(`/api/jobs/${jobId}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          setJobs(jobs.filter(j => j.id !== jobId))
        } else {
          console.error('Failed to delete job')
        }
      } catch (error) {
        console.error('Error deleting job:', error)
      }
    }
  }

  const handleSaveCase = async (caseStudy: Case) => {
    try {
      // 轉換數據格式以匹配後端期望
      const caseData = {
        title: caseStudy.title,
        industry: caseStudy.industry,
        challenge: caseStudy.challenge,
        solution: caseStudy.solution,
        results: caseStudy.results
      }
      
      const response = await fetch(`/api/cases/${caseStudy.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caseData)
      })
      
      if (response.ok) {
        const updatedCase = await response.json()
        // 轉換後端返回的數據格式以匹配前端期望
        const formattedCase = {
          ...updatedCase,
          results: typeof updatedCase.results === 'string' ? JSON.parse(updatedCase.results) : updatedCase.results,
          isActive: updatedCase.is_active
        }
        setCases(cases.map(c => c.id === caseStudy.id ? formattedCase : c))
        setEditingCase(null)
      } else {
        console.error('Failed to update case')
        const errorData = await response.text()
        console.error('Error response:', errorData)
      }
    } catch (error) {
      console.error('Error updating case:', error)
    }
  }

  const handleAddCase = async (caseStudy: Case) => {
    try {
      console.log('Adding case:', caseStudy)
      // 轉換數據格式以匹配後端期望
      const caseData = {
        title: caseStudy.title,
        industry: caseStudy.industry,
        challenge: caseStudy.challenge,
        solution: caseStudy.solution,
        results: caseStudy.results
      }
      
      console.log('Sending to backend:', caseData)
      
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caseData)
      })
      
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const addedCase = await response.json()
        console.log('Backend response:', addedCase)
        // 轉換後端返回的數據格式以匹配前端期望
        const formattedCase = {
          ...addedCase,
          results: typeof addedCase.results === 'string' ? JSON.parse(addedCase.results) : addedCase.results,
          isActive: addedCase.is_active
        }
        console.log('Formatted case for frontend:', formattedCase)
        setCases([...cases, formattedCase])
        setShowAddCaseModal(false)
        setNewCase({
          title: '',
          industry: '',
          challenge: '',
          solution: '',
          results: [],
          isActive: true
        })
      } else {
        console.error('Failed to add case')
        const errorData = await response.text()
        console.error('Error response:', errorData)
      }
    } catch (error) {
      console.error('Error adding case:', error)
    }
  }

  const handleDeleteCase = async (caseId: number) => {
    if (confirm('Are you sure you want to delete this case study?')) {
      try {
        const response = await fetch(`/api/cases/${caseId}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          setCases(cases.filter(c => c.id !== caseId))
        } else {
          console.error('Failed to delete case')
        }
      } catch (error) {
        console.error('Error deleting case:', error)
      }
    }
  }

  const handleAddNews = async () => {
    try {
      // 將日期格式從 YYYY-MM-DD 轉換為 ISO 日期時間格式
      const formatDateForBackend = (dateString: string) => {
        if (!dateString) return new Date().toISOString()
        // 如果已經是 ISO 格式，直接返回
        if (dateString.includes('T')) return dateString
        // 否則轉換為 ISO 格式
        return new Date(dateString + 'T00:00:00').toISOString()
      }
      
      // 轉換數據格式以匹配後端期望
      const newsData = {
        title: newNews.title,
        content: newNews.content,
        category: newNews.category,
        published_date: formatDateForBackend(newNews.publishedDate),
        is_published: newNews.isPublished,
        images: newNews.images
      }
      
      const response = await fetch('/api/news/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsData),
      })
      
      if (response.ok) {
        const addedNews = await response.json()
        // 轉換後端返回的數據格式以匹配前端期望
        const formattedNews = {
          ...addedNews,
          publishedDate: addedNews.published_date,
          isPublished: addedNews.is_published,
          images: addedNews.images || []
        }
        setNews([...news, formattedNews])
        setShowAddNewsModal(false)
        setNewNews({
          title: '',
          content: '',
          category: '',
          publishedDate: new Date().toISOString().split('T')[0],
          isPublished: true,
          images: []
        })
      } else {
        console.error('Failed to add news')
        const errorData = await response.text()
        console.error('Error response:', errorData)
      }
    } catch (error) {
      console.error('Error adding news:', error)
    }
  }

  const handleEditNews = async (newsItem: News) => {
    try {
      console.log('Original newsItem:', newsItem)
      console.log('Original publishedDate:', newsItem.publishedDate)
      
      const formattedDate = formatDateForBackend(newsItem.publishedDate)
      console.log('Formatted date for backend:', formattedDate)
      
      // 轉換數據格式以匹配後端期望
      const newsData = {
        title: newsItem.title,
        content: newsItem.content,
        category: newsItem.category,
        published_date: formattedDate,
        is_published: newsItem.isPublished,
        images: newsItem.images
      }
      
      console.log('Sending to backend:', newsData)
      
      const response = await fetch(`/api/news/${newsItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsData),
      })
      
      if (response.ok) {
        const updatedNews = await response.json()
        console.log('Backend response:', updatedNews)
        
        // 轉換後端返回的數據格式以匹配前端期望
        const formattedNews = {
          ...updatedNews,
          publishedDate: formatDateForDisplay(updatedNews.published_date),
          isPublished: updatedNews.is_published,
          images: updatedNews.images || []
        }
        console.log('Formatted news for frontend:', formattedNews)
        
        setNews(news.map(n => n.id === newsItem.id ? formattedNews : n))
        setEditingNews(null)
      } else {
        console.error('Failed to update news')
        const errorData = await response.text()
        console.error('Error response:', errorData)
      }
    } catch (error) {
      console.error('Error updating news:', error)
    }
  }

  const handleDeleteNews = async (newsId: number) => {
    if (confirm('Are you sure you want to delete this news item?')) {
      try {
        const response = await fetch(`/api/news/${newsId}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          setNews(news.filter(n => n.id !== newsId))
        } else {
          console.error('Failed to delete news')
        }
      } catch (error) {
        console.error('Error deleting news:', error)
      }
    }
  }

  // Techniques CRUD functions
  const handleSaveTechnique = async (technique: Technique) => {
    try {
      const techniqueData = {
        name: technique.name,
        category: technique.category,
        description: technique.description,
        features: technique.features
      }
      
      const response = await fetch(`/api/techniques/${technique.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(techniqueData)
      })
      
      if (response.ok) {
        const updatedTechnique = await response.json()
        const formattedTechnique = {
          ...updatedTechnique,
          features: Array.isArray(updatedTechnique.features) ? updatedTechnique.features : 
                   typeof updatedTechnique.features === 'string' ? JSON.parse(updatedTechnique.features) : 
                   updatedTechnique.features || [],
          isActive: updatedTechnique.is_active
        }
        setTechniques(techniques.map(t => t.id === technique.id ? formattedTechnique : t))
        setEditingTechnique(null)
      } else {
        console.error('Failed to update technique')
        const errorData = await response.text()
        console.error('Error response:', errorData)
      }
    } catch (error) {
      console.error('Error updating technique:', error)
    }
  }

  const handleAddTechnique = async (technique: Technique) => {
    try {
      const techniqueData = {
        name: technique.name,
        category: technique.category,
        description: technique.description,
        features: technique.features
      }
      
      const response = await fetch('/api/techniques/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(techniqueData)
      })
      
      if (response.ok) {
        const addedTechnique = await response.json()
        const formattedTechnique = {
          ...addedTechnique,
          features: Array.isArray(addedTechnique.features) ? addedTechnique.features : 
                   typeof addedTechnique.features === 'string' ? JSON.parse(addedTechnique.features) : 
                   addedTechnique.features || [],
          isActive: addedTechnique.is_active
        }
        setTechniques([...techniques, formattedTechnique])
        setShowAddTechniqueModal(false)
        setNewTechnique({
          name: '',
          category: '',
          description: '',
          features: [],
          isActive: true
        })
      } else {
        console.error('Failed to add technique')
        const errorData = await response.text()
        console.error('Error response:', errorData)
      }
    } catch (error) {
      console.error('Error adding technique:', error)
    }
  }

  const handleDeleteTechnique = async (techniqueId: number) => {
    if (confirm('Are you sure you want to delete this technique?')) {
      try {
        const response = await fetch(`/api/techniques/${techniqueId}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          setTechniques(techniques.filter(t => t.id !== techniqueId))
        } else {
          console.error('Failed to delete technique')
        }
      } catch (error) {
        console.error('Error deleting technique:', error)
      }
    }
  }

  // Products CRUD functions
  const handleSaveProduct = async (product: Product) => {
    try {
      const productData = {
        name: product.name,
        category: product.category,
        description: product.description,
        features: product.features,
        price: product.price
      }
      
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
      
      if (response.ok) {
        const updatedProduct = await response.json()
        const formattedProduct = {
          ...updatedProduct,
          features: Array.isArray(updatedProduct.features) ? updatedProduct.features : 
                   typeof updatedProduct.features === 'string' ? JSON.parse(updatedProduct.features) : 
                   updatedProduct.features || [],
          isActive: updatedProduct.is_active
        }
        setProducts(products.map(p => p.id === product.id ? formattedProduct : p))
        setEditingProduct(null)
      } else {
        console.error('Failed to update product')
        const errorData = await response.text()
        console.error('Error response:', errorData)
      }
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const handleAddProduct = async (product: Product) => {
    try {
      const productData = {
        name: product.name,
        category: product.category,
        description: product.description,
        features: product.features,
        price: product.price
      }
      
      const response = await fetch('/api/products/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
      
      if (response.ok) {
        const addedProduct = await response.json()
        const formattedProduct = {
          ...addedProduct,
          features: Array.isArray(addedProduct.features) ? addedProduct.features : 
                   typeof addedProduct.features === 'string' ? JSON.parse(addedProduct.features) : 
                   addedProduct.features || [],
          isActive: addedProduct.is_active
        }
        setProducts([...products, formattedProduct])
        setShowAddProductModal(false)
        setNewProduct({
          name: '',
          category: '',
          description: '',
          features: [],
          price: '',
          isActive: true
        })
      } else {
        console.error('Failed to add product')
        const errorData = await response.text()
        console.error('Error response:', errorData)
      }
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          setProducts(products.filter(p => p.id !== productId))
        } else {
          console.error('Failed to delete product')
        }
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  // 時區處理函數
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return ''
    // 如果已經是 YYYY-MM-DD 格式，直接返回
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString
    }
    // 如果是 ISO 格式，轉換為本地日期，避免時區偏移
    const date = new Date(dateString)
    // 使用 UTC 方法避免時區偏移
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatDateForBackend = (dateString: string) => {
    console.log('formatDateForBackend input:', dateString)
    if (!dateString) {
      console.log('No date string, using current date')
      return new Date().toISOString()
    }
    // 如果已經是 ISO 格式，直接返回
    if (dateString.includes('T')) {
      console.log('Already ISO format, returning as is')
      return dateString
    }
    // 否則轉換為 ISO 格式，使用 UTC 時間避免時區偏移
    const utcDate = new Date(dateString + 'T00:00:00.000Z')
    const isoDate = utcDate.toISOString()
    console.log('Converted to ISO format:', isoDate)
    return isoDate
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-surface p-8 rounded-lg shadow-lg w-full max-w-md"
        >
          <div className="text-center mb-6">
            <Shield className="h-12 w-12 text-avocado-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">酪梨智慧 Admin</h1>
            <p className="text-gray-400">Enter your credentials to access the admin panel</p>
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
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="bg-dark-surface shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-avocado-600" />
              <h1 className="text-xl font-bold text-white">酪梨智慧 Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/" 
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-sm">回首頁</span>
              </a>
              <a 
                href="https://github.com/AvocadoAI-Lab" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-sm">GitHub</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-400 hover:text-white"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-dark-surface rounded-lg p-1 mb-8">
          {[
            { id: 'jobs', label: 'Jobs', icon: Briefcase },
            { id: 'news', label: 'News', icon: FileText },
            { id: 'cases', label: 'Cases', icon: Users },
            { id: 'techniques', label: 'Techniques', icon: Zap },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-avocado-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-dark-surface rounded-lg shadow">
          {activeTab === 'jobs' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Job Management</h2>
                <button 
                  onClick={() => setShowAddJobModal(true)}
                  className="btn-primary flex items-center space-x-2"
                >
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
                        {job.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {job.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-avocado-100 text-avocado-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
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
                <button 
                  onClick={() => setShowAddNewsModal(true)}
                  className="btn-primary flex items-center space-x-2"
                >
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
                        <p className="text-sm text-gray-500 mt-1">{item.content.substring(0, 100)}...</p>
                        <p className="text-xs text-gray-400 mt-1">Published: {formatDateForDisplay(item.publishedDate)}</p>
                        {item.images.length > 0 && (
                          <div className="flex items-center mt-2">
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              📷 {item.images.length} 張圖片
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setEditingNews(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteNews(item.id)}
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

          {activeTab === 'cases' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Case Studies Management</h2>
                <button 
                  onClick={() => setShowAddCaseModal(true)}
                  className="btn-primary flex items-center space-x-2"
                >
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
                        <button 
                          onClick={() => setEditingCase(caseStudy)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCase(caseStudy.id)}
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

          {activeTab === 'techniques' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Techniques Management</h2>
                <button 
                  onClick={() => setShowAddTechniqueModal(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Technique</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {techniques.map((technique) => (
                  <div key={technique.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{technique.name}</h3>
                        <p className="text-gray-600">{technique.category}</p>
                        <p className="text-sm text-gray-500 mt-1">{technique.description.substring(0, 100)}...</p>
                        {technique.features.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {technique.features.slice(0, 3).map((feature, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {feature}
                              </span>
                            ))}
                            {technique.features.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                +{technique.features.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setEditingTechnique(technique)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTechnique(technique.id)}
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

          {activeTab === 'products' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
                <button 
                  onClick={() => setShowAddProductModal(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Product</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-gray-600">{product.category}</p>
                        <p className="text-sm text-gray-500 mt-1">{product.description.substring(0, 100)}...</p>
                        <p className="text-sm text-avocado-600 font-medium mt-1">{product.price}</p>
                        {product.features.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {product.features.slice(0, 3).map((feature, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                              >
                                {feature}
                              </span>
                            ))}
                            {product.features.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                +{product.features.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setEditingProduct(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
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

      {/* Add News Modal */}
      {showAddNewsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add News</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newNews.title}
                  onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={newNews.content}
                  onChange={(e) => setNewNews({...newNews, content: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={newNews.category}
                  onChange={(e) => setNewNews({...newNews, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Published Date</label>
                <input
                  type="date"
                  value={newNews.publishedDate}
                  onChange={(e) => setNewNews({...newNews, publishedDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newNews.isPublished}
                  onChange={(e) => setNewNews({...newNews, isPublished: e.target.checked})}
                  className="h-4 w-4 text-avocado-600 focus:ring-avocado-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Published</label>
              </div>
              
              {/* 圖片管理 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Images (最多3張)</label>
                <div className="space-y-2">
                  {/* 現有圖片顯示 */}
                  {newNews.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {newNews.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`News image ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            onClick={() => {
                              const updatedImages = newNews.images.filter((_, i) => i !== index)
                              setNewNews({...newNews, images: updatedImages})
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* 圖片上傳 */}
                  {newNews.images.length < 3 && (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files
                          if (files && files.length > 0) {
                            const newImages = Array.from(files).map(file => URL.createObjectURL(file))
                            const updatedImages = [...newNews.images, ...newImages].slice(0, 3)
                            setNewNews({...newNews, images: updatedImages})
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">已上傳 {newNews.images.length}/3 張圖片</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddNewsModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNews}
                className="px-4 py-2 bg-avocado-600 text-white rounded-md hover:bg-avocado-700"
              >
                Add News
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit News Modal */}
      {editingNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit News</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingNews.title}
                  onChange={(e) => setEditingNews({...editingNews, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={editingNews.content}
                  onChange={(e) => setEditingNews({...editingNews, content: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={editingNews.category}
                  onChange={(e) => setEditingNews({...editingNews, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Published Date</label>
                <input
                  type="date"
                  value={formatDateForDisplay(editingNews.publishedDate)}
                  onChange={(e) => setEditingNews({...editingNews, publishedDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingNews.isPublished}
                  onChange={(e) => setEditingNews({...editingNews, isPublished: e.target.checked})}
                  className="h-4 w-4 text-avocado-600 focus:ring-avocado-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Published</label>
              </div>
              
              {/* 圖片管理 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Images (最多3張)</label>
                <div className="space-y-2">
                  {/* 現有圖片顯示 */}
                  {editingNews.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {editingNews.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`News image ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            onClick={() => {
                              const updatedImages = editingNews.images.filter((_, i) => i !== index)
                              setEditingNews({...editingNews, images: updatedImages})
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* 圖片上傳 */}
                  {editingNews.images.length < 3 && (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files
                          if (files && files.length > 0) {
                            const newImages = Array.from(files).map(file => URL.createObjectURL(file))
                            const updatedImages = [...editingNews.images, ...newImages].slice(0, 3)
                            setEditingNews({...editingNews, images: updatedImages})
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">已上傳 {editingNews.images.length}/3 張圖片</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingNews(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEditNews(editingNews)}
                className="px-4 py-2 bg-avocado-600 text-white rounded-md hover:bg-avocado-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Job Modal */}
      {showAddJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Job</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newJob.department}
                    onChange={(e) => setNewJob({...newJob, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newJob.type}
                    onChange={(e) => setNewJob({...newJob, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                <input
                  type="text"
                  value={newJob.salary}
                  onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (one per line)</label>
                <textarea
                  value={newJob.requirements.join('\n')}
                  onChange={(e) => setNewJob({...newJob, requirements: e.target.value.split('\n').filter(r => r.trim())})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  placeholder="Enter requirements, one per line"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Benefits (one per line)</label>
                <textarea
                  value={newJob.benefits.join('\n')}
                  onChange={(e) => setNewJob({...newJob, benefits: e.target.value.split('\n').filter(b => b.trim())})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  placeholder="Enter benefits, one per line"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Type a tag and press Enter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const input = e.target as HTMLInputElement
                        const tag = input.value.trim()
                        if (tag && !newJob.tags.includes(tag)) {
                          setNewJob({...newJob, tags: [...newJob.tags, tag]})
                          input.value = ''
                        }
                      }
                    }}
                  />
                  {availableTags.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Available tags: {availableTags.join(', ')}
                    </div>
                  )}
                  {newJob.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newJob.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-avocado-100 text-avocado-800"
                        >
                          {tag}
                          <button
                            onClick={() => setNewJob({...newJob, tags: newJob.tags.filter((_, i) => i !== index)})}
                            className="ml-1 text-avocado-600 hover:text-avocado-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddJobModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddJob(newJob as Job)}
                className="px-4 py-2 bg-avocado-600 text-white rounded-md hover:bg-avocado-700"
              >
                Add Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Job</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingJob.title}
                    onChange={(e) => setEditingJob({...editingJob, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={editingJob.department}
                    onChange={(e) => setEditingJob({...editingJob, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editingJob.location}
                    onChange={(e) => setEditingJob({...editingJob, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={editingJob.type}
                    onChange={(e) => setEditingJob({...editingJob, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                <input
                  type="text"
                  value={editingJob.salary}
                  onChange={(e) => setEditingJob({...editingJob, salary: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingJob.description}
                  onChange={(e) => setEditingJob({...editingJob, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (one per line)</label>
                <textarea
                  value={editingJob.requirements.join('\n')}
                  onChange={(e) => setEditingJob({...editingJob, requirements: e.target.value.split('\n').filter(r => r.trim())})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Benefits (one per line)</label>
                <textarea
                  value={editingJob.benefits.join('\n')}
                  onChange={(e) => setEditingJob({...editingJob, benefits: e.target.value.split('\n').filter(b => b.trim())})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Type a tag and press Enter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const input = e.target as HTMLInputElement
                        const tag = input.value.trim()
                        if (tag && !editingJob.tags.includes(tag)) {
                          setEditingJob({...editingJob, tags: [...editingJob.tags, tag]})
                          input.value = ''
                        }
                      }
                    }}
                  />
                  {availableTags.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Available tags: {availableTags.join(', ')}
                    </div>
                  )}
                  {editingJob.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {editingJob.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-avocado-100 text-avocado-800"
                        >
                          {tag}
                          <button
                            onClick={() => setEditingJob({...editingJob, tags: editingJob.tags.filter((_, i) => i !== index)})}
                            className="ml-1 text-avocado-600 hover:text-avocado-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingJob(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveJob(editingJob)}
                className="px-4 py-2 bg-avocado-600 text-white rounded-md hover:bg-avocado-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Case Modal */}
      {showAddCaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Case Study</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newCase.title}
                    onChange={(e) => setNewCase({...newCase, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <input
                    type="text"
                    value={newCase.industry}
                    onChange={(e) => setNewCase({...newCase, industry: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Challenge</label>
                <textarea
                  value={newCase.challenge}
                  onChange={(e) => setNewCase({...newCase, challenge: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Solution</label>
                <textarea
                  value={newCase.solution}
                  onChange={(e) => setNewCase({...newCase, solution: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Results (one per line)</label>
                <textarea
                  value={newCase.results ? newCase.results.join('\n') : ''}
                  onChange={(e) => setNewCase({...newCase, results: e.target.value.split('\n').filter(r => r.trim())})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  placeholder="Enter results, one per line"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddCaseModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddCase(newCase as Case)}
                className="px-4 py-2 bg-avocado-600 text-white rounded-md hover:bg-avocado-700"
              >
                Add Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Case Modal */}
      {editingCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Case Study</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingCase.title}
                    onChange={(e) => setEditingCase({...editingCase, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <input
                    type="text"
                    value={editingCase.industry}
                    onChange={(e) => setEditingCase({...editingCase, industry: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Challenge</label>
                <textarea
                  value={editingCase.challenge}
                  onChange={(e) => setEditingCase({...editingCase, challenge: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Solution</label>
                <textarea
                  value={editingCase.solution}
                  onChange={(e) => setEditingCase({...editingCase, solution: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Results (one per line)</label>
                <textarea
                  value={editingCase.results ? editingCase.results.join('\n') : ''}
                  onChange={(e) => setEditingCase({...editingCase, results: e.target.value.split('\n').filter(r => r.trim())})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingCase(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveCase(editingCase)}
                className="px-4 py-2 bg-avocado-600 text-white rounded-md hover:bg-avocado-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Technique Modal */}
      {showAddTechniqueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Technique</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newTechnique.name}
                    onChange={(e) => setNewTechnique({...newTechnique, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={newTechnique.category}
                    onChange={(e) => setNewTechnique({...newTechnique, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTechnique.description}
                  onChange={(e) => setNewTechnique({...newTechnique, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
                <textarea
                  value={newTechnique.features.join('\n')}
                  onChange={(e) => setNewTechnique({...newTechnique, features: e.target.value.split('\n').filter(f => f.trim())})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  placeholder="Enter features, one per line"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddTechniqueModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddTechnique(newTechnique as Technique)}
                className="px-4 py-2 bg-avocado-600 text-white rounded-md hover:bg-avocado-700"
              >
                Add Technique
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Technique Modal */}
      {editingTechnique && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Technique</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editingTechnique.name}
                    onChange={(e) => setEditingTechnique({...editingTechnique, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingTechnique.category}
                    onChange={(e) => setEditingTechnique({...editingTechnique, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingTechnique.description}
                  onChange={(e) => setEditingTechnique({...editingTechnique, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
                <textarea
                  value={editingTechnique.features.join('\n')}
                  onChange={(e) => setEditingTechnique({...editingTechnique, features: e.target.value.split('\n').filter(f => f.trim())})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingTechnique(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveTechnique(editingTechnique)}
                className="px-4 py-2 bg-avocado-600 text-white rounded-md hover:bg-avocado-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Product</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
                <textarea
                  value={newProduct.features.join('\n')}
                  onChange={(e) => setNewProduct({...newProduct, features: e.target.value.split('\n').filter(f => f.trim())})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  placeholder="Enter features, one per line"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="text"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddProductModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddProduct(newProduct as Product)}
                className="px-4 py-2 bg-avocado-600 text-white rounded-md hover:bg-avocado-700"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Product</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
                <textarea
                  value={editingProduct.features.join('\n')}
                  onChange={(e) => setEditingProduct({...editingProduct, features: e.target.value.split('\n').filter(f => f.trim())})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="text"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveProduct(editingProduct)}
                className="px-4 py-2 bg-avocado-600 text-white rounded-md hover:bg-avocado-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 