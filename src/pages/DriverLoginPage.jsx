import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function DriverLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      
      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      // Check if user is a driver
      const { data: driverData, error: driverError } = await supabase
        .from('drivers')
        .select('*')
        .eq('user_id', data.user.id)
        .single()

      if (driverError && driverError.code !== 'PGRST116') {
        setError('Error checking driver status')
        setLoading(false)
        return
      }

      if (!driverData) {
        setError('This account is not registered as a driver')
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      // Redirect based on driver status
      switch (driverData.status) {
        case 'pending':
          navigate('/driver/application')
          break
        case 'review':
          navigate('/driver/pending')
          break
        case 'approved':
          navigate('/driver/dashboard')
          break
        case 'rejected':
          navigate('/driver/rejected')
          break
        case 'suspended':
          navigate('/driver/suspended')
          break
        default:
          navigate('/driver/dashboard')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
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
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: '32px', marginBottom: 8 }}>🚌</div>
          <h2 style={{ margin: 0, color: '#333' }}>Driver Login</h2>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>
            Access your driver dashboard
          </p>
        </div>
        
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
          
          {error && (
            <div style={{ 
              color: '#dc3545', 
              fontSize: 14, 
              textAlign: 'center',
              padding: 8,
              backgroundColor: '#f8d7da',
              borderRadius: 4
            }}>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              padding: 12,
              backgroundColor: loading ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <p style={{ margin: 0, color: '#666' }}>
            New driver? <Link to="/driver/signup" style={{ color: '#4CAF50' }}>Apply here</Link>
          </p>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>
            <Link to="/" style={{ color: '#4CAF50' }}>Back to Passenger App</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
