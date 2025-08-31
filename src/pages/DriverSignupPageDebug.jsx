import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function DriverSignupPageDebug() {
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
  const [debugInfo, setDebugInfo] = useState([])

  const addDebugInfo = (message) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const testDatabaseConnection = async () => {
    addDebugInfo('Testing database connection...')
    
    try {
      // Test basic connection
      const { data, error } = await supabase.from('drivers').select('count(*)')
      if (error) {
        addDebugInfo(`Database test failed: ${error.message}`)
        return false
      }
      addDebugInfo('Database connection successful')
      return true
    } catch (err) {
      addDebugInfo(`Database connection error: ${err.message}`)
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setDebugInfo([])

    addDebugInfo('Starting driver signup process...')

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
      // Test database first
      const dbConnected = await testDatabaseConnection()
      if (!dbConnected) {
        setError('Database connection failed. Please run the setup script.')
        setLoading(false)
        return
      }

      addDebugInfo('Creating user account...')
      
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
        addDebugInfo(`Auth error: ${authError.message}`)
        setError(authError.message)
        setLoading(false)
        return
      }

      addDebugInfo(`User created with ID: ${data.user?.id}`)

      if (data.user) {
        addDebugInfo('Creating driver profile...')
        
        const driverData = {
          user_id: data.user.id,
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          status: 'pending'
        }
        
        addDebugInfo(`Driver data: ${JSON.stringify(driverData)}`)

        // Create driver profile
        const { error: driverError } = await supabase
          .from('drivers')
          .insert([driverData])

        if (driverError) {
          addDebugInfo(`Driver profile error: ${JSON.stringify(driverError)}`)
          setError(`Driver profile creation failed: ${driverError.message}`)
          setLoading(false)
          return
        }

        addDebugInfo('Driver profile created successfully!')
        addDebugInfo('Redirecting to application page...')
        
        // Redirect to application form
        navigate('/driver/application')
      }
    } catch (err) {
      addDebugInfo(`Unexpected error: ${err.message}`)
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
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: 800
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: 32,
          color: '#333'
        }}>
          Driver Signup (Debug Mode)
        </h1>
        
        <div style={{ display: 'flex', gap: 32 }}>
          {/* Form */}
          <div style={{ flex: 1 }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="fullName" style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #ddd',
                    borderRadius: 4,
                    fontSize: 16
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label htmlFor="phoneNumber" style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #ddd',
                    borderRadius: 4,
                    fontSize: 16
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #ddd',
                    borderRadius: 4,
                    fontSize: 16
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label htmlFor="password" style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #ddd',
                    borderRadius: 4,
                    fontSize: 16
                  }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #ddd',
                    borderRadius: 4,
                    fontSize: 16
                  }}
                />
              </div>

              {error && (
                <div style={{
                  marginBottom: 16,
                  padding: 12,
                  backgroundColor: '#ffe6e6',
                  color: '#d63031',
                  borderRadius: 4
                }}>
                  {error}
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={loading}
                style={{
                  width: '100%',
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
          </div>

          {/* Debug Panel */}
          <div style={{ flex: 1 }}>
            <h3>Debug Information</h3>
            <div style={{ 
              backgroundColor: '#f8f9fa',
              padding: 16,
              borderRadius: 4,
              height: 400,
              overflowY: 'auto',
              fontFamily: 'monospace',
              fontSize: 12
            }}>
              {debugInfo.length === 0 ? (
                <p>Debug info will appear here during signup...</p>
              ) : (
                debugInfo.map((info, index) => (
                  <div key={index} style={{ marginBottom: 4 }}>
                    {info}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
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
