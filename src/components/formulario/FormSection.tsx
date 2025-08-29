import React from 'react'

interface FormSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function FormSection({ title, children, className = '' }: FormSectionProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Section Title */}
      <div className="border-b border-default pb-2">
        <h2 className="text-base font-semibold text-white">
          {title}
        </h2>
      </div>
      
      {/* Section Content */}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
}