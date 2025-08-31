import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'

export default function DriverApplicationPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    notes: ''
  })
  const [documents, setDocuments] = useState({
    licensePhoto: null,
    vehicleRegistration: null,
    aadharCard: null,
    panCard: null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDriverData()
    }
  }, [user])

  const loadDriverData = async () => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading driver data:', error)
        return
      }

      if (data) {
        setFormData({
          fullName: data.full_name || '',
          phoneNumber: data.phone || '',
          email: data.email || '',
          notes: data.notes || ''
        })
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setInitialLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files && files[0]) {
      setDocuments(prev => ({
        ...prev,
        [name]: files[0]
      }))
    }
  }

  const uploadDocument = async (file, path) => {
    const { data, error } = await supabase.storage
      .from('driver-documents')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      throw error
    }

    return data.path
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Update driver record with simplified fields
      const { error: updateError } = await supabase
        .from('drivers')
        .update({
          full_name: formData.fullName,
          phone: formData.phoneNumber,
          email: formData.email,
          notes: formData.notes,
          status: 'approved', // Auto-approve for demo purposes
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) {
        setError('Failed to save application')
        console.error('Update error:', updateError)
        setLoading(false)
        return
      }

      // Redirect to dashboard since we auto-approve
      navigate('/driver/dashboard')
    } catch (err) {
      setError('An error occurred while submitting your application')
      console.error('Submit error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: 16
    }}>
      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 32,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '32px', marginBottom: 8 }}>📋</div>
          <h2 style={{ margin: 0, color: '#333' }}>Driver Application</h2>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>
            Complete your application to become a NextStop driver
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
          {/* Personal Information */}
          <section>
            <h3 style={{ color: '#333', marginBottom: 16 }}>Personal Information</h3>
            <div style={{ display: 'grid', gap: 12 }}>
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
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                style={{
                  padding: 12,
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  fontSize: 16
                }}
              />
              <textarea
                name="notes"
                placeholder="Additional Notes (driving experience, vehicle type, etc.)"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                style={{
                  padding: 12,
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  fontSize: 16,
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
          </section>

          {error && (
            <div style={{
              color: '#dc3545',
              fontSize: 14,
              textAlign: 'center',
              padding: 12,
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
              padding: 16,
              backgroundColor: loading ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 16
            }}
          >
            {loading ? 'Submitting Application...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  )
}
