import React from 'react'

interface ProgressBarStickyProps {
  steps: string[]
  currentStep: number
}

export function ProgressBarSticky({ steps, currentStep }: ProgressBarStickyProps) {
  const progress = (currentStep / steps.length) * 100

  return (
    <div className="sticky top-0 z-50 bg-[var(--bg)] border-b border-default p-3">
      <div className="max-w-lg mx-auto">
        {/* Progress Info */}
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-muted">
            Paso {currentStep} de {steps.length}
          </div>
          <div className="text-sm text-subtle">
            {Math.round(progress)}% completado
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Current Step Name */}
        <div className="text-sm font-medium text-white mt-2 text-center">
          {steps[currentStep - 1]}
        </div>
      </div>
    </div>
  )
}