import React from 'react'

interface NavigationButtonsProps {
  currentStep: number
  totalSteps: number
  isCurrentStepValid: boolean
  onPrevious: () => void
  onNext: () => void
  onSubmit?: () => void
  isSubmitting?: boolean
}

export function NavigationButtons({ 
  currentStep, 
  totalSteps, 
  isCurrentStepValid, 
  onPrevious, 
  onNext,
  onSubmit,
  isSubmitting = false
}: NavigationButtonsProps) {
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps

  return (
    <div className="flex justify-between mt-8">
      {/* Botón Anterior */}
      {!isFirstStep ? (
        <button
          type="button"
          onClick={onPrevious}
          className="bg-surface hover:bg-elevated border border-default text-white px-4 py-2 rounded-2xl min-h-[44px] font-medium transition-colors focus-ring"
        >
          Anterior
        </button>
      ) : (
        <div></div>
      )}

      {/* Botón Siguiente o Enviar */}
      {!isLastStep ? (
        <button
          type="button"
          onClick={onNext}
          disabled={!isCurrentStepValid}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!isCurrentStepValid || isSubmitting}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed relative"
        >
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="loading w-5 h-5" />
            </div>
          )}
          <span className={isSubmitting ? 'opacity-0' : 'opacity-100'}>
            Subir Formulario
          </span>
        </button>
      )}
    </div>
  )
}