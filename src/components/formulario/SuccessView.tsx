
interface SuccessViewProps {
  nvCode?: string
}

export function SuccessView({ nvCode }: SuccessViewProps) {
  return (
    <div className="text-center py-12 px-4">
      {/* Success Icon */}
      <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      {/* Success Message */}
      <h2 className="text-xl font-semibold text-white mb-3">
        ¡Formulario enviado con éxito!
      </h2>
      
      <p className="text-muted text-base leading-relaxed mb-4">
        Gracias por completar tu inscripción. 
        <br />
        Hemos recibido tu información correctamente.
      </p>

      {nvCode && (
        <div className="bg-surface border border-default rounded-lg p-3 inline-block">
          <div className="text-sm text-muted mb-1">Registrado para proyecto:</div>
          <div className="text-lg font-mono font-semibold text-orange-400">{nvCode}</div>
        </div>
      )}
    </div>
  )
}