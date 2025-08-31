import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function DriverSignupPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      // Create user account
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            user_type: 'driver'
          }
        }
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        // Create driver profile
        const { error: driverError } = await supabase
          .from('drivers')
          .insert([
            {
              full_name: formData.fullName,
              phone: formData.phoneNumber,
              email: formData.email,
              status: 'pending'
            }
          ])

        if (driverError) {
          console.error('Error creating driver profile:', driverError)
          setError('Failed to create driver profile')
          setLoading(false)
          return
        }

        // Redirect to application form
        navigate('/driver/application')
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
          <h2 style={{ margin: 0, color: '#333' }}>Become a Driver</h2>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>
            Join our network of professional drivers
          </p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <input 
            type="text" 
            name="fullName"
            placeholder="Full Name" 
            value={formData.fullName}
            onChange={handleChange}
            required
            style={{
              padding: 12,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 16
            }}
          />

          <input 
            type="tel" 
            name="phoneNumber"
            placeholder="Phone Number" 
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            style={{
              padding: 12,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 16
            }}
          />
          
          <input 
            type="email" 
            name="email"
            placeholder="Email address" 
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            placeholder="Password (min 6 characters)" 
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            style={{
              padding: 12,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 16
            }}
          />

          <input 
            type="password" 
            name="confirmPassword"
            placeholder="Confirm Password" 
            value={formData.confirmPassword}
            onChange={handleChange}
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <p style={{ margin: 0, color: '#666' }}>
            Already have an account? <Link to="/driver/login" style={{ color: '#4CAF50' }}>Sign in here</Link>
          </p>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>
            <Link to="/" style={{ color: '#4CAF50' }}>Back to Passenger App</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
