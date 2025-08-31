import React from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function DriverPendingPage() {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
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
        padding: 40,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: 500,
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: 16 }}>⏳</div>
        <h2 style={{ margin: '0 0 16px 0', color: '#333' }}>Application Under Review</h2>
        <p style={{ color: '#666', lineHeight: 1.6, marginBottom: 24 }}>
          Thank you for submitting your driver application! Our team is currently reviewing your documents and information. 
          This process typically takes 2-3 business days.
        </p>
        <p style={{ color: '#666', lineHeight: 1.6, marginBottom: 24 }}>
          You will receive an email notification once your application has been reviewed. 
          Please check your email regularly for updates.
        </p>
        
        <div style={{ 
          backgroundColor: '#e3f2fd', 
          padding: 16, 
          borderRadius: 6, 
          marginBottom: 24,
          border: '1px solid #bbdefb'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>What happens next?</h4>
          <ul style={{ textAlign: 'left', color: '#666', margin: 0, paddingLeft: 20 }}>
            <li>Document verification (1-2 days)</li>
            <li>Background check (1-2 days)</li>
            <li>Vehicle inspection (if applicable)</li>
            <li>Final approval and route assignment</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link
            to="/driver/application"
            style={{
              padding: '12px 24px',
              backgroundColor: '#4CAF50',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 4,
              fontSize: 16
            }}
          >
            Update Application
          </Link>
          <button
            onClick={handleSignOut}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 16
            }}
          >
            Sign Out
          </button>
        </div>
        
        <div style={{ marginTop: 20 }}>
          <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
            Need help? Contact us at{' '}
            <a href="mailto:support@nextstop.com" style={{ color: '#4CAF50' }}>
              support@nextstop.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
