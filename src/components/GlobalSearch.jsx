import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { MathuraDataService } from '../services/MathuraDataService'

export default function GlobalSearch({ onSearchResults, onLocationSelect }) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [searchType, setSearchType] = useState('all') // 'all', 'buses', 'routes', 'stops'
  const [recentSearches, setRecentSearches] = useState([])
  const searchRef = useRef(null)

  // Real search function using Supabase
  const performSearch = async (query) => {
    if (query.length < 2) return []

    setIsSearching(true)
    try {
      const results = []
      
      // Search routes
      if (searchType === 'all' || searchType === 'routes') {
        const routes = await MathuraDataService.searchRoutes(query)
        results.push(...routes.map(route => ({
          id: route.id,
          type: 'route',
          title: route.name,
          subtitle: `${route.start_location} → ${route.end_location}`,
          status: route.active ? 'active' : 'inactive',
          icon: '🛣️',
          data: route
        })))
      }

      // Search buses (simplified - could expand to search by number/driver)
      if (searchType === 'all' || searchType === 'buses') {
        // Get all active routes and extract bus info
        const activeRoutes = await MathuraDataService.getActiveRoutes()
        activeRoutes.forEach(route => {
          if (route.buses) {
            route.buses.forEach(bus => {
              if (bus.bus_number.toLowerCase().includes(query.toLowerCase()) ||
                  (bus.drivers?.full_name || '').toLowerCase().includes(query.toLowerCase())) {
                results.push({
                  id: bus.id,
                  type: 'bus',
                  title: bus.bus_number,
                  subtitle: `Route: ${route.name} | Driver: ${bus.drivers?.full_name || 'Unknown'}`,
                  status: bus.active ? 'active' : 'inactive',
                  icon: '🚌',
                  data: { ...bus, route }
                })
              }
            })
          }
        })
      }

      // Search stops (from route waypoints)
      if (searchType === 'all' || searchType === 'stops') {
        const routes = await MathuraDataService.searchRoutes('')
        routes.forEach(route => {
          if (route.waypoints && Array.isArray(route.waypoints)) {
            route.waypoints.forEach(stop => {
              if (stop.name.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                  id: `${route.id}_${stop.name}`,
                  type: 'stop',
                  title: stop.name,
                  subtitle: `Route: ${route.name} | Arrival: ${stop.arrival || 'Unknown'}`,
                  status: 'active',
                  icon: '🚏',
                  data: { ...stop, route }
                })
              }
            })
          }
        })
      }

      return results.slice(0, 10) // Limit to 10 results
    } catch (error) {
      console.error('Search error:', error)
      return []
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchQuery.trim()) {
        const results = await performSearch(searchQuery)
        setSearchResults(results)
        setShowResults(true)
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchQuery, searchType])

  const handleResultClick = (result) => {
    // Add to recent searches
    const newRecentSearches = [result, ...recentSearches.filter(r => r.id !== result.id)].slice(0, 5)
    setRecentSearches(newRecentSearches)
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches))
    
    setSearchQuery(result.title)
    setShowResults(false)
    onSearchResults?.(result)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowResults(false)
  }

  useEffect(() => {
    // Load recent searches
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('search.placeholder', 'Search buses, routes, or stops...')}
          className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 placeholder-gray-500"
        />
        
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Type Filters */}
      <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'All', icon: '🔍' },
          { key: 'buses', label: 'Buses', icon: '🚌' },
          { key: 'routes', label: 'Routes', icon: '🛣️' },
          { key: 'stops', label: 'Stops', icon: '🚏' }
        ].map((type) => (
          <button
            key={type.key}
            onClick={() => setSearchType(type.key)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              searchType === type.key
                ? 'bg-primary-100 text-primary-700 border border-primary-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{type.icon}</span>
            <span>{type.label}</span>
          </button>
        ))}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="p-2 border-b border-gray-100">
                <p className="text-xs text-gray-500 font-medium">SEARCH RESULTS</p>
              </div>
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full p-3 hover:bg-gray-50 text-left border-b border-gray-50 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{result.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{result.title}</p>
                      <p className="text-sm text-gray-500 truncate">{result.subtitle}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      result.status === 'active' 
                        ? 'bg-success-100 text-success-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {result.status}
                    </div>
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">No results found</p>
            </div>
          )}

          {/* Recent Searches */}
          {!searchQuery && recentSearches.length > 0 && (
            <>
              <div className="p-2 border-b border-gray-100">
                <p className="text-xs text-gray-500 font-medium">RECENT SEARCHES</p>
              </div>
              {recentSearches.map((result) => (
                <button
                  key={`recent-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full p-3 hover:bg-gray-50 text-left border-b border-gray-50 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{result.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{result.title}</p>
                      <p className="text-sm text-gray-500 truncate">{result.subtitle}</p>
                    </div>
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
