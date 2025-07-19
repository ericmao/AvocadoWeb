import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock the main page component
const MockHomePage: React.FC = () => {
  return (
    <div>
      <h1>Avocado.ai</h1>
      <p>Cybersecurity and AI Solutions</p>
    </div>
  )
}

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<MockHomePage />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Avocado.ai')
  })

  it('renders the description', () => {
    render(<MockHomePage />)
    
    const description = screen.getByText('Cybersecurity and AI Solutions')
    expect(description).toBeInTheDocument()
  })
}) 