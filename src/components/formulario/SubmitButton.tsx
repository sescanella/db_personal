import React from 'react'

interface SubmitButtonProps {
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function SubmitButton({ 
  disabled = false, 
  loading = false, 
  children, 
  onClick,
  className = ''
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed relative ${className}`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="loading w-5 h-5" />
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  )
}