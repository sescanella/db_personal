import React from 'react'

interface TextInputProps {
  name: string
  label: string
  required?: boolean
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string
  className?: string
}

export function TextInput({ 
  name, 
  label, 
  required = false, 
  value = '', 
  onChange, 
  placeholder,
  error,
  className = ''
}: TextInputProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-white">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="input-base focus-ring w-full"
      />
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  )
}