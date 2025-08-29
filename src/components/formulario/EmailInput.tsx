import React from 'react'

interface EmailInputProps {
  name: string
  label: string
  required?: boolean
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string
  className?: string
}

export function EmailInput({ 
  name, 
  label, 
  required = false, 
  value = '', 
  onChange, 
  placeholder = 'ejemplo@correo.com',
  error,
  className = ''
}: EmailInputProps) {
  const validateEmail = (email: string) => {
    return email.includes('@')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e)
    }
  }

  const isValid = value ? validateEmail(value) : true
  const showError = error || (value && !isValid && 'Debe contener @')

  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-white">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        type="email"
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className="input-base focus-ring w-full"
      />
      {showError && (
        <p className="text-red-400 text-sm">{showError}</p>
      )}
    </div>
  )
}