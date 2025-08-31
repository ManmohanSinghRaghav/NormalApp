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

      console.log('Auth signup response:', data)

      if (data.user) {
        console.log('User created successfully:', data.user.id)
        
        // Wait a moment for the user to be fully created in the database
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Verify the user exists in auth.users
        const { data: authUser, error: userCheckError } = await supabase.auth.getUser()
        console.log('Auth user check:', authUser, userCheckError)
        
        // First, test if we can read from the drivers table
        try {
          const { data: testRead, error: readError } = await supabase
            .from('drivers')
            .select('id')
            .limit(1)
          
          if (readError) {
            console.error('Cannot read from drivers table:', readError)
            setError(`Database access issue: ${readError.message}`)
            setLoading(false)
            return
          }
          
          console.log('Drivers table is accessible for reading')
        } catch (err) {
          console.error('Drivers table read test failed:', err)
          setError('Cannot access drivers table. Please check database setup.')
          setLoading(false)
          return
        }

        // Create driver profile with all required data
        let insertData = {
          user_id: data.user.id,
          full_name: formData.fullName,
          phone_number: formData.phoneNumber, // This is required (NOT NULL)
          status: 'pending'
        }

        console.log('Inserting driver data:', insertData)

        const { error: driverError } = await supabase
          .from('drivers')
          .insert([insertData])

        if (driverError) {
          console.error('Error creating driver profile:', driverError)
          console.error('Error details:', {
            message: driverError.message,
            details: driverError.details,
            hint: driverError.hint,
            code: driverError.code,
            statusCode: driverError.statusCode
          })
          console.error('Data being sent:', {
            user_id: data.user.id,
            full_name: formData.fullName,
            phone_number: formData.phoneNumber,
            status: 'pending'
          })
          
          // Check specific error types
          if (driverError.message.includes('foreign key constraint') || 
              driverError.message.includes('user_id_fkey')) {
            setError('User creation timing issue. Please try logging in instead - your account may have been created.')
            setTimeout(() => {
              navigate('/driver/login')
            }, 3000)
          } else if (driverError.message.includes('does not exist') || 
              driverError.message.includes('schema cache') ||
              driverError.message.includes('column')) {
            setError('Database structure issue. Please run the complete rebuild script in Supabase.')
          } else if (driverError.message.includes('permission') || 
                     driverError.message.includes('policy') ||
                     driverError.statusCode === 401) {
            setError('Database permission issue. Check Row Level Security policies.')
          } else {
            setError(`Failed to create driver profile: ${driverError.message || 'Unknown error'}`)
          }
          setLoading(false)
          return
        }

        console.log('Driver profile created successfully!')
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
          {/* <div style={{ fontSize: '32px', marginBottom: 8 }}>🚌</div */}
          <h2 style={{ fontSize: '32px', marginBottom: 8, color: '#333' }}>Become a Driver</h2>
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
