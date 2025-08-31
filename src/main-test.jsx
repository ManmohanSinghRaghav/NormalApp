import React from 'react'
import { createRoot } from 'react-dom/client'

// Simple test component
function TestApp() {
  console.log('TestApp rendering...')
  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      backgroundColor: 'white',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: 'green', fontSize: '48px' }}>✅ REACT IS WORKING!</h1>
      <h2 style={{ color: 'blue' }}>🚌 NextStop Test</h2>
      <p style={{ fontSize: '24px' }}>If you can see this, React is loading properly.</p>
      <div style={{ 
        backgroundColor: 'yellow', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>Debug Info:</h3>
        <p>React version: {React.version}</p>
        <p>Time: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  )
}

console.log('main.jsx loaded, mounting React...')

const root = createRoot(document.getElementById('root'))
root.render(<TestApp />)

console.log('React mounted successfully!')
