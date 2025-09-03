'use client'

import { useState } from 'react'
import { Filter, X } from 'lucide-react'

export default function ProjectFilters({ onFilterChange }) {
  const [selectedFilters, setSelectedFilters] = useState({
    city: '',
    developer: '',
    type: ''
  })

  const filters = {
    city: ['Delhi NCR', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune'],
    developer: ['DLF', 'Shobha', 'M3M', 'Godrej', 'Brigade'],
    type: ['Residential', 'Commercial', 'Plots', 'Villas']
  }

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...selectedFilters,
      [filterType]: value === selectedFilters[filterType] ? '' : value
    }
    setSelectedFilters(newFilters)
    onFilterChange(newFilters) // Pass filters to parent component
  }

  const clearFilters = () => {
    const clearedFilters = { city: '', developer: '', type: '' }
    setSelectedFilters(clearedFilters)
    onFilterChange(clearedFilters) // Pass cleared filters to parent
  }

  const activeFiltersCount = Object.values(selectedFilters).filter(Boolean).length

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filter Projects</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm">
              {activeFiltersCount} active
            </span>
          )}
        </div>
        
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <div className="flex flex-wrap gap-2">
            {filters.city.map(city => (
              <button
                key={city}
                onClick={() => handleFilterChange('city', city)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilters.city === city
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Developer Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Developer</label>
          <div className="flex flex-wrap gap-2">
            {filters.developer.map(developer => (
              <button
                key={developer}
                onClick={() => handleFilterChange('developer', developer)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilters.developer === developer
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {developer}
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
          <div className="flex flex-wrap gap-2">
            {filters.type.map(type => (
              <button
                key={type}
                onClick={() => handleFilterChange('type', type)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilters.type === type
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">Active filters: </span>
          {Object.entries(selectedFilters).map(([key, value]) =>
            value && (
              <span
                key={key}
                className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm mx-1"
              >
                {value}
                <button
                  onClick={() => handleFilterChange(key, '')}
                  className="hover:text-amber-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )
          )}
        </div>
      )}
    </div>
  )
}
