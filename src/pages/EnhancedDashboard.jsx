import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout'
import GlobalSearch from '../components/GlobalSearch'
import Map from '../components/Map'

export default function Dashboard() {
  const { t } = useTranslation()
  const [searchResults, setSearchResults] = useState(null)
  const [showLocationBadge, setShowLocationBadge] = useState(true)
  const [currentLocation, setCurrentLocation] = useState({
    city: 'Mathura',
    state: 'Uttar Pradesh',
    coordinates: [27.4924, 77.6737]
  })

  const handleLocationSelect = () => {
    // Handle location selection
    console.log('Location selection clicked')
  }

  const handleSearchResults = (results) => {
    setSearchResults(results)
    console.log('Search results:', results)
  }

  return (
    <Layout>
      <div className="h-full flex flex-col bg-gray-50">
        {/* Location Badge */}
        {showLocationBadge && (
          <div className="bg-white border-b border-gray-200 px-4 py-2">
            <div className="flex items-center justify-between">
              <button
                onClick={handleLocationSelect}
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="text-left">
                  <div className="font-medium text-sm">{currentLocation.city}</div>
                  <div className="text-xs text-gray-500">{currentLocation.state}</div>
                </div>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => setShowLocationBadge(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <GlobalSearch 
            onSearchResults={handleSearchResults}
            onLocationSelect={handleLocationSelect}
          />
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <Map searchResults={searchResults} />
          
          {/* Quick Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-40 map-overlay">
            <button className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow">
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            
            <button className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow">
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            
            <button className="bg-primary-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow text-white">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>

          {/* Live Updates Indicator */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-40 map-overlay">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                {t('dashboard.liveUpdates', 'Live Updates')}
              </span>
            </div>
          </div>

          {/* Stats Overlay */}
          <div className="absolute bottom-20 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-40 map-overlay">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-600">24</div>
                <div className="text-xs text-gray-600">{t('dashboard.activeBuses', 'Active Buses')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success-600">18</div>
                <div className="text-xs text-gray-600">{t('dashboard.onTime', 'On Time')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning-600">6</div>
                <div className="text-xs text-gray-600">{t('dashboard.delayed', 'Delayed')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
