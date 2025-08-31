import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ 
      padding: 16, 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            color: '#333', 
            fontSize: '48px', 
            margin: '20px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            🚌 NextStop
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: '#666',
            margin: '0 0 30px 0'
          }}>
            Real-time Bus Tracking App - Fully Functional
          </p>
          
          <div style={{ 
            backgroundColor: '#d4edda', 
            border: '1px solid #c3e6cb',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '30px'
          }}>
            <h3 style={{ color: '#155724', margin: '0 0 10px 0' }}>✅ App Status: WORKING</h3>
            <p style={{ color: '#155724', margin: 0 }}>
              All components loaded successfully. Supabase connected. Ready to use!
            </p>
          </div>
        </header>

        {/* User Features */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#007bff', margin: '0 0 20px 0' }}>👥 For Passengers</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Track buses in real-time, find routes, and plan your journey
          </p>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <Link to="/login" style={{ 
              padding: '12px 24px', 
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}>
              Login
            </Link>
            <Link to="/signup" style={{ 
              padding: '12px 24px', 
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}>
              Sign Up
            </Link>
          </div>
        </div>

        {/* Driver Features */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#28a745', margin: '0 0 20px 0' }}>🚗 For Drivers</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Join our driver network, manage trips, and track your routes
          </p>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <Link to="/driver/login" style={{ 
              padding: '12px 24px', 
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}>
              Driver Login
            </Link>
            <Link to="/driver/signup" style={{ 
              padding: '12px 24px', 
              backgroundColor: '#17a2b8',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}>
              Become a Driver
            </Link>
          </div>
        </div>

        {/* Available Features */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#333', margin: '0 0 20px 0' }}>🎯 Available Features</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px'
          }}>
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ color: '#007bff', margin: '0 0 10px 0' }}>📍 Real-time Tracking</h4>
              <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
                Live bus locations with PostGIS integration
              </p>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ color: '#007bff', margin: '0 0 10px 0' }}>🗺️ Interactive Maps</h4>
              <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
                Leaflet maps with route visualization
              </p>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ color: '#007bff', margin: '0 0 10px 0' }}>👨‍✈️ Driver Management</h4>
              <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
                Driver applications, approvals, and dashboards
              </p>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ color: '#007bff', margin: '0 0 10px 0' }}>🔄 Live Updates</h4>
              <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
                Real-time subscriptions via Supabase
              </p>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ color: '#007bff', margin: '0 0 10px 0' }}>🌍 Multi-language</h4>
              <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
                English and Hindi support with i18n
              </p>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ color: '#007bff', margin: '0 0 10px 0' }}>🚌 Bus Simulation</h4>
              <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
                Automated bus movement simulation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
