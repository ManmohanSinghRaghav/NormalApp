import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    
    if (error) {
      setError(error.message)
      return
    }
    
    navigate('/', { replace: true })
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      padding: 16
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: 32, 
        borderRadius: 8, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: 400
      }}>
        <h2 style={{ marginBottom: 24, textAlign: 'center' }}>Welcome Back</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <input 
            type="email" 
            placeholder="Email address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ 
              padding: 12, 
              border: '1px solid #ddd', 
              borderRadius: 4, 
              fontSize: 16 
            }}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ 
              padding: 12, 
              border: '1px solid #ddd', 
              borderRadius: 4, 
              fontSize: 16 
            }}
          />
          <button 
            disabled={loading} 
            type="submit"
            style={{ 
              padding: 12, 
              backgroundColor: loading ? '#ccc' : '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: 4, 
              fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          {error && (
            <div style={{ 
              color: '#dc3545', 
              textAlign: 'center', 
              fontSize: 14 
            }}>
              {error}
            </div>
          )}
        </form>
        
        <p style={{ textAlign: 'center', marginTop: 24, color: '#666' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#007bff' }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}
