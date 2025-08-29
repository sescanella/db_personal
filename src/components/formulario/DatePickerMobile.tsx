import React from 'react'

interface DatePickerMobileProps {
  name: string
  label: string
  required?: boolean
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  className?: string
}

export function DatePickerMobile({ 
  name, 
  label, 
  required = false, 
  value = '', 
  onChange, 
  error,
  className = ''
}: DatePickerMobileProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-white">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="input-base focus-ring w-full"
      />
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  )
}