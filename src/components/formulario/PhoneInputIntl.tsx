import React, { useState } from 'react'

interface PhoneCountry {
  code: string
  dial: string
  name: string
}

const phoneCountries: PhoneCountry[] = [
  { code: 'CL', dial: '+56', name: 'Chile' },
  { code: 'AR', dial: '+54', name: 'Argentina' },
  { code: 'PE', dial: '+51', name: 'Perú' },
  { code: 'BO', dial: '+591', name: 'Bolivia' },
  { code: 'BR', dial: '+55', name: 'Brasil' },
  { code: 'CO', dial: '+57', name: 'Colombia' },
  { code: 'EC', dial: '+593', name: 'Ecuador' },
  { code: 'PY', dial: '+595', name: 'Paraguay' },
  { code: 'UY', dial: '+598', name: 'Uruguay' },
  { code: 'VE', dial: '+58', name: 'Venezuela' }
]

interface PhoneInputIntlProps {
  name: string
  label: string
  required?: boolean
  value?: string
  onChange?: (value: string) => void // E.164 format
  error?: string
  className?: string
}

export function PhoneInputIntl({ 
  name, 
  label, 
  required = false, 
  value = '', 
  onChange, 
  error,
  className = ''
}: PhoneInputIntlProps) {
  const [selectedCountry, setSelectedCountry] = useState<PhoneCountry>(phoneCountries[0]) // +56 por defecto
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isCountryOpen, setIsCountryOpen] = useState(false)

  const handleCountrySelect = (country: PhoneCountry) => {
    setSelectedCountry(country)
    setIsCountryOpen(false)
    updateE164Format(country, phoneNumber)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value.replace(/\D/g, '') // Solo dígitos
    setPhoneNumber(number)
    updateE164Format(selectedCountry, number)
  }

  const updateE164Format = (country: PhoneCountry, number: string) => {
    if (onChange) {
      const e164 = number ? `${country.dial}${number}` : ''
      onChange(e164)
    }
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-white">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      
      <div className="flex space-x-2">
        {/* Country Code Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsCountryOpen(!isCountryOpen)}
            className="input-base focus-ring flex items-center space-x-1 min-w-[80px]"
          >
            <span className="text-sm">{selectedCountry.dial}</span>
            <svg className="w-3 h-3 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Country Dropdown */}
          {isCountryOpen && (
            <div className="absolute z-50 w-48 mt-1 bg-elevated border border-default rounded-lg shadow-lg">
              <div className="max-h-48 overflow-y-auto">
                {phoneCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className="w-full px-3 py-2 text-left hover:bg-surface text-sm flex justify-between"
                  >
                    <span>{country.name}</span>
                    <span className="text-muted">{country.dial}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          id={name}
          name={name}
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="912345678"
          required={required}
          className="input-base focus-ring flex-1"
        />
      </div>

      {/* E.164 Preview */}
      {value && (
        <div className="text-xs text-muted">
          Formato E.164: {value}
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  )
}