import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth.jsx'
import { LanguageSwitcherMini } from './LanguageSelector.jsx'
import UserProfile from './UserProfile.jsx'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Layout({ children }) {
  const { t } = useTranslation()
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showMenu, setShowMenu] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut()
      setShowMenu(false)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const navItems = [
    { 
      icon: '🗺️', 
      label: t('nav.map', 'Map'), 
      path: '/',
      active: location.pathname === '/'
    },
    { 
      icon: '🚌', 
      label: t('nav.buses', 'Buses'), 
      path: '/buses',
      active: location.pathname === '/buses'
    },
    { 
      icon: '🚏', 
      label: t('nav.stops', 'Stops'), 
      path: '/stops',
      active: location.pathname === '/stops'
    },
    { 
      icon: '⭐', 
      label: t('nav.favorites', 'Favorites'), 
      path: '/favorites',
      active: location.pathname === '/favorites'
    }
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 z-60 relative">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-2xl">🚌</div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">NextStop</h1>
              <p className="text-xs text-gray-500">{t('app.tagline', 'Real-time Bus Tracking')}</p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <LanguageSwitcherMini />
            
            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h5m4 0V2a1 1 0 011-1h1a1 1 0 011 1v3h3a1 1 0 011 1v1a1 1 0 01-1 1h-3v3a1 1 0 01-1 1h-1a1 1 0 01-1-1V8z" />
              </svg>
              <div className="absolute -top-1 -right-1 bg-danger-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </div>
            </button>
            
            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  U
                </div>
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-70">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowProfile(true)
                          setShowMenu(false)
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-50 transition-colors"
                      >
                        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">{t('nav.profile', 'Profile')}</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          navigate('/settings')
                          setShowMenu(false)
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-50 transition-colors"
                      >
                        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">{t('nav.settings', 'Settings')}</span>
                      </button>
                      
                      <div className="border-t border-gray-100 my-1" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-50 transition-colors text-danger-600"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="text-sm font-medium">{t('nav.logout', 'Logout')}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-4 py-2 z-60 relative">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                item.active 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Profile Modal */}
      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}
    </div>
  )
}
