import React, { useEffect, useState } from 'react'

interface AccountNumberInputProps {
  name: string
  label: string
  required?: boolean
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  bankFieldRef: string // Valor del campo banco para validación condicional
  error?: string
  className?: string
}

export function AccountNumberInput({ 
  name, 
  label, 
  required = false, 
  value = '', 
  onChange, 
  bankFieldRef,
  error,
  className = ''
}: AccountNumberInputProps) {
  const [validationError, setValidationError] = useState<string>('')
  
  const isBancoEstado = bankFieldRef === 'BANCOESTADO'
  const maxDigits = isBancoEstado ? 8 : undefined

  useEffect(() => {
    if (value && isBancoEstado) {
      const digits = value.replace(/\D/g, '')
      if (digits.length > 8) {
        setValidationError('Banco Estado: máximo 8 dígitos')
      } else {
        setValidationError('')
      }
    } else {
      setValidationError('')
    }
  }, [value, isBancoEstado])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value
    
    // Solo permitir dígitos
    inputValue = inputValue.replace(/\D/g, '')
    
    // Aplicar límite para Banco Estado
    if (isBancoEstado && inputValue.length > 8) {
      inputValue = inputValue.slice(0, 8)
    }
    
    // Crear evento sintético con el valor filtrado
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: inputValue
      }
    }
    
    if (onChange) {
      onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>)
    }
  }

  const displayError = error || validationError
  const helperText = isBancoEstado 
    ? 'Solo dígitos, máximo 8 para Banco Estado' 
    : 'Solo dígitos, sin puntos ni guiones'

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
        onChange={handleChange}
        placeholder={isBancoEstado ? '12345678' : '1234567890'}
        required={required}
        maxLength={maxDigits}
        className="input-base focus-ring w-full"
      />
      
      <div className="text-xs text-subtle">
        {helperText}
        {maxDigits && value && (
          <span className="ml-2">
            ({value.length}/{maxDigits})
          </span>
        )}
      </div>

      {displayError && (
        <p className="text-red-400 text-sm">{displayError}</p>
      )}
    </div>
  )
}