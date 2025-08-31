import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  console.log('Home component rendering...')
  
  return (
    <div style={{ 
      padding: 16, 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      fontSize: '18px'
    }}>
      <h1 style={{ color: 'red', fontSize: '48px' }}>🚌 NextStop - TEST</h1>
      <p style={{ color: 'blue', fontSize: '24px' }}>If you can see this, the app is working!</p>
      
      <div style={{ backgroundColor: 'yellow', padding: '20px', margin: '20px 0' }}>
        <h2>Navigation Test</h2>
        <Link to="/login" style={{ 
          display: 'inline-block',
          padding: '10px 20px', 
          backgroundColor: 'green',
          color: 'white',
          textDecoration: 'none',
          margin: '10px'
        }}>
          Go to Login
        </Link>
        <Link to="/signup" style={{ 
          display: 'inline-block',
          padding: '10px 20px', 
          backgroundColor: 'blue',
          color: 'white',
          textDecoration: 'none',
          margin: '10px'
        }}>
          Go to Signup
        </Link>
      </div>
    </div>
  )
}
