import React, { useState, useEffect } from 'react'
import { countries } from '../../utils/countries'

type Country = {
  code: string
  name: string
}

interface CountrySelectISOProps {
  name: string
  label: string
  required?: boolean
  value?: string
  onChange?: (value: string) => void
  error?: string
  className?: string
}

export function CountrySelectISO({ 
  name, 
  label, 
  required = false, 
  value = 'CL', // Chile por defecto
  onChange, 
  error,
  className = ''
}: CountrySelectISOProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(countries)

  useEffect(() => {
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCountries(filtered)
  }, [searchTerm])

  const selectedCountry = countries.find(c => c.code === value) || countries[0]

  const handleSelect = (country: Country) => {
    if (onChange) {
      onChange(country.code.toUpperCase())
    }
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-white">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      
      <div className="relative">
        {/* Selected Value Display */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="input-base focus-ring w-full text-left flex items-center justify-between"
        >
          <span>{selectedCountry.name}</span>
          <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-elevated border border-default rounded-lg shadow-lg">
            {/* Search Input */}
            <div className="p-2">
              <input
                type="text"
                placeholder="Buscar país..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1 bg-surface border border-input rounded text-sm focus:border-primary focus:outline-none"
              />
            </div>
            
            {/* Options List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className="w-full px-3 py-2 text-left hover:bg-surface text-sm flex items-center justify-between"
                >
                  <span>{country.name}</span>
                  <span className="text-xs text-muted">{country.code}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  )
}