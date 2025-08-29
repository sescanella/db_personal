import React from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  name: string
  label: string
  options: SelectOption[]
  required?: boolean
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  placeholder?: string
  error?: string
  className?: string
}

export function Select({ 
  name, 
  label, 
  options, 
  required = false, 
  value = '', 
  onChange, 
  placeholder = 'Seleccionar...',
  error,
  className = ''
}: SelectProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-white">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="select-base focus-ring w-full"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  )
}