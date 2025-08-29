import React, { useState, useEffect } from 'react'
import regionesData from '../../../docs/comunas-regiones.json'

interface Region {
  region: string
  comunas: string[]
}

interface CascadingRegionComunaProps {
  regionName: string
  comunaName: string  
  required?: boolean
  regionValue?: string
  comunaValue?: string
  onRegionChange?: (value: string) => void
  onComunaChange?: (value: string) => void
  regionError?: string
  comunaError?: string
  className?: string
}

export function CascadingRegionComuna({ 
  regionName,
  comunaName,
  required = false, 
  regionValue = '', 
  comunaValue = '',
  onRegionChange, 
  onComunaChange,
  regionError,
  comunaError,
  className = ''
}: CascadingRegionComunaProps) {
  const [regiones] = useState<Region[]>(regionesData.regiones)
  const [availableComunas, setAvailableComunas] = useState<string[]>([])
  const [regionSearchTerm, setRegionSearchTerm] = useState('')
  const [comunaSearchTerm, setComunaSearchTerm] = useState('')
  const [isRegionOpen, setIsRegionOpen] = useState(false)
  const [isComunaOpen, setIsComunaOpen] = useState(false)

  // Update available comunas when region changes
  useEffect(() => {
    if (regionValue) {
      const selectedRegion = regiones.find(r => r.region === regionValue)
      setAvailableComunas(selectedRegion?.comunas || [])
      
      // Reset comuna if not valid for new region
      if (comunaValue && selectedRegion && !selectedRegion.comunas.includes(comunaValue)) {
        if (onComunaChange) {
          onComunaChange('')
        }
      }
    } else {
      setAvailableComunas([])
      if (onComunaChange) {
        onComunaChange('')
      }
    }
  }, [regionValue, regiones, comunaValue, onComunaChange])

  const filteredRegiones = regiones.filter(region =>
    region.region.toLowerCase().includes(regionSearchTerm.toLowerCase())
  )

  const filteredComunas = availableComunas.filter(comuna =>
    comuna.toLowerCase().includes(comunaSearchTerm.toLowerCase())
  )

  const handleRegionSelect = (region: string) => {
    if (onRegionChange) {
      onRegionChange(region)
    }
    setIsRegionOpen(false)
    setRegionSearchTerm('')
  }

  const handleComunaSelect = (comuna: string) => {
    if (onComunaChange) {
      onComunaChange(comuna)
    }
    setIsComunaOpen(false)
    setComunaSearchTerm('')
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Región Selector */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-white">
          Región {required && <span className="text-primary">*</span>}
        </label>
        
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsRegionOpen(!isRegionOpen)}
            className="input-base focus-ring w-full text-left flex items-center justify-between"
          >
            <span className={regionValue ? 'text-white' : 'text-muted'}>
              {regionValue || 'Seleccionar región...'}
            </span>
            <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isRegionOpen && (
            <div className="absolute z-50 w-full mt-1 bg-elevated border border-default rounded-lg shadow-lg">
              {/* Search Input */}
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Buscar región..."
                  value={regionSearchTerm}
                  onChange={(e) => setRegionSearchTerm(e.target.value)}
                  className="w-full px-2 py-1 bg-surface border border-input rounded text-sm focus:border-primary focus:outline-none"
                />
              </div>
              
              {/* Options List */}
              <div className="max-h-48 overflow-y-auto">
                {filteredRegiones.map((region) => (
                  <button
                    key={region.region}
                    type="button"
                    onClick={() => handleRegionSelect(region.region)}
                    className="w-full px-3 py-2 text-left hover:bg-surface text-sm"
                  >
                    {region.region}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {regionError && (
          <p className="text-red-400 text-sm">{regionError}</p>
        )}
      </div>

      {/* Comuna Selector */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-white">
          Comuna {required && <span className="text-primary">*</span>}
        </label>
        
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsComunaOpen(!isComunaOpen)}
            disabled={!regionValue}
            className="input-base focus-ring w-full text-left flex items-center justify-between disabled:opacity-50"
          >
            <span className={comunaValue ? 'text-white' : 'text-muted'}>
              {comunaValue || (regionValue ? 'Seleccionar comuna...' : 'Primero seleccione región')}
            </span>
            <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isComunaOpen && regionValue && (
            <div className="absolute z-50 w-full mt-1 bg-elevated border border-default rounded-lg shadow-lg">
              {/* Search Input */}
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Buscar comuna..."
                  value={comunaSearchTerm}
                  onChange={(e) => setComunaSearchTerm(e.target.value)}
                  className="w-full px-2 py-1 bg-surface border border-input rounded text-sm focus:border-primary focus:outline-none"
                />
              </div>
              
              {/* Options List */}
              <div className="max-h-48 overflow-y-auto">
                {filteredComunas.map((comuna) => (
                  <button
                    key={comuna}
                    type="button"
                    onClick={() => handleComunaSelect(comuna)}
                    className="w-full px-3 py-2 text-left hover:bg-surface text-sm"
                  >
                    {comuna}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {comunaError && (
          <p className="text-red-400 text-sm">{comunaError}</p>
        )}
      </div>
    </div>
  )
}