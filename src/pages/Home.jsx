import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ 
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Navigation Header */}
      <nav style={{
        padding: '15px 0',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>⌖</span>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>NextStop</span>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/login" style={{ 
              padding: '6px 16px', 
              color: '#10b981',
              textDecoration: 'none',
              fontWeight: '500',
              borderRadius: '6px',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}>
              Login
            </Link>
            <Link to="/signup" style={{ 
              padding: '6px 16px', 
              backgroundColor: '#10b981',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Scrollable Content */}
      <div style={{ 
        height: 'calc(100vh - 70px)', 
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        {/* Hero Section */}
        <section style={{ padding: '40px 20px', textAlign: 'center', color: 'white', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700',
              margin: '0 0 15px 0',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              lineHeight: '1.1'
            }}>
              Smart Bus Tracking
              <br />
              <span style={{ color: '#a7f3d0' }}>Made Simple</span>
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              opacity: 0.9,
              maxWidth: '600px',
              margin: '0 auto 30px auto'
            }}>
              Track buses in real-time, find optimal routes, and never miss your ride again with our intelligent transportation platform.
            </p>
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" style={{ 
                padding: '12px 25px', 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '1rem',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>▶</span> Start Tracking
              </Link>
              <Link to="/driver/signup" style={{ 
                padding: '12px 25px', 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#10b981',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>●</span> Join as Driver
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{ padding: '40px 20px', background: 'rgba(255, 255, 255, 0.95)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h2 style={{ 
                fontSize: '2rem', 
                fontWeight: '700',
                color: '#333',
                margin: '0 0 15px 0'
              }}>
                Why Choose NextStop?
              </h2>
              <p style={{ 
                fontSize: '1rem', 
                color: '#666',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Experience the future of public transportation with our cutting-edge features
              </p>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '25px',
              marginBottom: '30px'
            }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '15px', 
                padding: '25px',
                color: 'white',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px', fontWeight: 'bold' }}>⌖</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 10px 0' }}>Real-time Tracking</h3>
                <p style={{ opacity: 0.9, lineHeight: '1.5', fontSize: '0.9rem', marginBottom: '15px' }}>
                  Get live bus locations with pinpoint accuracy using our advanced GPS tracking system
                </p>
                <Link to="/signup" style={{ 
                  display: 'inline-block',
                  padding: '8px 20px', 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '20px',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease'
                }}>
                  Start Tracking →
                </Link>
              </div>

              <div style={{ 
                background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                borderRadius: '15px', 
                padding: '25px',
                color: 'white',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px', fontWeight: 'bold' }}>●</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 10px 0' }}>Driver Portal</h3>
                <p style={{ opacity: 0.9, lineHeight: '1.5', fontSize: '0.9rem', marginBottom: '15px' }}>
                  Join our network of professional drivers and manage your routes efficiently
                </p>
                <Link to="/driver/signup" style={{ 
                  display: 'inline-block',
                  padding: '8px 20px', 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '20px',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease'
                }}>
                  Join Network →
                </Link>
              </div>
            </div>

            {/* Feature Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px'
            }}>
              <div style={{ 
                padding: '20px', 
                backgroundColor: 'white', 
                borderRadius: '12px',
                boxShadow: '0 5px 15px rgba(16,185,129,0.1)',
                textAlign: 'center',
                border: '1px solid rgba(16,185,129,0.1)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px', fontWeight: 'bold', color: '#10b981' }}>◉</div>
                <h4 style={{ color: '#10b981', margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '600' }}>Interactive Maps</h4>
                <p style={{ color: '#666', margin: 0, lineHeight: '1.4', fontSize: '0.85rem' }}>
                  Navigate with beautiful, responsive maps powered by Leaflet
                </p>
              </div>

              <div style={{ 
                padding: '20px', 
                backgroundColor: 'white', 
                borderRadius: '12px',
                boxShadow: '0 5px 15px rgba(16,185,129,0.1)',
                textAlign: 'center',
                border: '1px solid rgba(16,185,129,0.1)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px', fontWeight: 'bold', color: '#10b981' }}>↻</div>
                <h4 style={{ color: '#10b981', margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '600' }}>Live Updates</h4>
                <p style={{ color: '#666', margin: 0, lineHeight: '1.4', fontSize: '0.85rem' }}>
                  Receive instant notifications about bus arrivals and delays
                </p>
              </div>

              <div style={{ 
                padding: '20px', 
                backgroundColor: 'white', 
                borderRadius: '12px',
                boxShadow: '0 5px 15px rgba(16,185,129,0.1)',
                textAlign: 'center',
                border: '1px solid rgba(16,185,129,0.1)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px', fontWeight: 'bold', color: '#10b981' }}>⚡</div>
                <h4 style={{ color: '#10b981', margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '600' }}>High Performance</h4>
                <p style={{ color: '#666', margin: 0, lineHeight: '1.4', fontSize: '0.85rem' }}>
                  Built with React and optimized for speed with Supabase
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ 
          padding: '30px 20px', 
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: '700',
              margin: '0 0 15px 0'
            }}>
              Ready to Transform Your Commute?
            </h2>
            <p style={{ 
              fontSize: '1rem', 
              margin: '0 0 25px 0',
              opacity: 0.9
            }}>
              Join thousands of satisfied users who have revolutionized their daily transportation experience
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" style={{ 
                padding: '12px 30px', 
                backgroundColor: 'white',
                color: '#10b981',
                textDecoration: 'none',
                borderRadius: '25px',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>▶</span> Get Started Free
              </Link>
              <Link to="/driver/login" style={{ 
                padding: '12px 30px', 
                backgroundColor: 'transparent',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '25px',
                fontWeight: '600',
                fontSize: '1rem',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>●</span> Driver Portal
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ 
          padding: '25px 20px', 
          backgroundColor: '#065f46',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
              <span style={{ fontSize: '20px', marginRight: '8px', fontWeight: 'bold', color: '#10b981' }}>⌖</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>NextStop</span>
            </div>
            <p style={{ opacity: 0.7, margin: '0 0 15px 0', fontSize: '0.9rem' }}>
              Making public transportation smarter, faster, and more reliable.
            </p>
            <div style={{ 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
              paddingTop: '15px',
              opacity: 0.6
            }}>
              <p style={{ margin: 0, fontSize: '12px' }}>
                © 2025 NextStop. Built with React, Supabase, and ❤️
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}