import React, { useState } from 'react'
import { ProgressBarSticky, FormSection, TextInput, DatePickerMobile, Select, CountrySelectISO, EmailInput, PhoneInputIntl, CascadingRegionComuna, AccountNumberInput, SizeSelect, SubmitButton, SuccessView, NavigationButtons } from '../components/formulario'
import { ESTADOS_CIVIL, SEXOS, BANCOS, TIPOS_CUENTA, AFPS, SALUD, AFC, TALLAS_SUPERIOR, TALLAS_INFERIOR, TALLAS_ZAPATO } from '../utils/constants'
import { toTitleCase } from '../utils/formatters'

interface FormData {
  // Datos Personales
  nombre: string
  apellido: string
  segundo_apellido: string
  numero_documento: string
  fecha_nacimiento: string
  sexo: string
  estado_civil: string
  pais_nacimiento: string
  // Contacto
  telefono_particular: string
  email_personal: string
  // Dirección
  calle: string
  numero_calle: string
  depto_oficina: string
  ciudad: string // Región
  comuna: string
  // Contacto de Emergencia
  contacto_emergencia_nombre: string
  contacto_emergencia_telefono: string
  // Datos Bancarios
  banco: string
  tipo_cuenta: string
  numero_cuenta: string
  // Previsión
  fondo_cotizacion: string
  salud: string
  afc: string
  // Tallas
  talla_superior: string
  talla_inferior: string
  talla_zapato: number | string
}

export function FormularioInscripcion() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    segundo_apellido: '',
    numero_documento: '',
    fecha_nacimiento: '',
    sexo: '',
    estado_civil: '',
    pais_nacimiento: 'CL',
    telefono_particular: '',
    email_personal: '',
    calle: '',
    numero_calle: '',
    depto_oficina: '',
    ciudad: '',
    comuna: '',
    contacto_emergencia_nombre: '',
    contacto_emergencia_telefono: '',
    banco: '',
    tipo_cuenta: '',
    numero_cuenta: '',
    fondo_cotizacion: '',
    salud: '',
    afc: '',
    talla_superior: '',
    talla_inferior: '',
    talla_zapato: ''
  })
  
  const steps = [
    'Datos Personales',
    'Contacto',
    'Dirección',
    'Contacto de Emergencia', 
    'Datos Bancarios',
    'Previsión',
    'Tallas'
  ]

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value
    
    // Aplicar Title Case a nombres
    if (field === 'nombre' || field === 'apellido' || field === 'segundo_apellido' || field === 'contacto_emergencia_nombre') {
      value = toTitleCase(value)
    }
    
    // Limpiar número de documento (solo dígitos)
    if (field === 'numero_documento') {
      value = value.replace(/\D/g, '')
    }
    
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCountryChange = (value: string) => {
    setFormData(prev => ({ ...prev, pais_nacimiento: value }))
  }

  const handlePhoneChange = (field: 'telefono_particular' | 'contacto_emergencia_telefono') => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRegionChange = (value: string) => {
    setFormData(prev => ({ ...prev, ciudad: value }))
  }

  const handleComunaChange = (value: string) => {
    setFormData(prev => ({ ...prev, comuna: value }))
  }

  // Validar si todos los campos requeridos están completos
  const isFormValid = () => {
    const requiredFields = [
      'nombre', 'apellido', 'numero_documento', 'fecha_nacimiento', 
      'sexo', 'estado_civil', 'pais_nacimiento',
      'telefono_particular', 'email_personal',
      'calle', 'ciudad', 'comuna',
      'contacto_emergencia_nombre', 'contacto_emergencia_telefono',
      'banco', 'tipo_cuenta', 'numero_cuenta',
      'fondo_cotizacion', 'salud', 'afc',
      'talla_superior', 'talla_inferior', 'talla_zapato'
    ]
    
    return requiredFields.every(field => {
      const value = formData[field as keyof FormData]
      return value && value.toString().trim() !== ''
    }) && formData.email_personal.includes('@')
  }

  // Validar si la sección actual está completa
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1: // Datos Personales
        return formData.nombre.trim() !== '' && 
               formData.apellido.trim() !== '' && 
               formData.numero_documento.trim() !== '' && 
               formData.fecha_nacimiento.trim() !== '' && 
               formData.sexo.trim() !== '' && 
               formData.estado_civil.trim() !== '' && 
               formData.pais_nacimiento.trim() !== ''
      case 2: // Contacto
        return formData.telefono_particular.trim() !== '' && 
               formData.email_personal.trim() !== '' && 
               formData.email_personal.includes('@')
      case 3: // Dirección
        return formData.calle.trim() !== '' && 
               formData.ciudad.trim() !== '' && 
               formData.comuna.trim() !== ''
      case 4: // Contacto de Emergencia
        return formData.contacto_emergencia_nombre.trim() !== '' && 
               formData.contacto_emergencia_telefono.trim() !== ''
      case 5: // Datos Bancarios
        return formData.banco.trim() !== '' && 
               formData.tipo_cuenta.trim() !== '' && 
               formData.numero_cuenta.trim() !== ''
      case 6: // Previsión
        return formData.fondo_cotizacion.trim() !== '' && 
               formData.salud.trim() !== '' && 
               formData.afc.trim() !== ''
      case 7: // Tallas
        return formData.talla_superior.trim() !== '' && 
               formData.talla_inferior.trim() !== '' && 
               formData.talla_zapato.toString().trim() !== ''
      default:
        return false
    }
  }

  const nextStep = () => {
    if (currentStep < 7 && isCurrentStepValid()) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Simular envío (aquí iría la llamada a la API)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSubmitted(true)
      console.log('Formulario enviado:', formData)
    } catch (error) {
      console.error('Error al enviar formulario:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Banner Superior */}
      <div className="bg-surface border-b border-default">
        <div className="max-w-lg mx-auto p-4">
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/src/assets/logo-blanco.svg" 
              alt="Logo" 
              className="w-8 h-8"
            />
            <h1 className="text-lg font-semibold text-white">
              Formulario de Inscripción
            </h1>
          </div>
          <div className="text-sm text-muted">
            Tiempo estimado: 8-10 minutos
          </div>
        </div>
      </div>

      {/* Barra de Progreso Sticky */}
      <ProgressBarSticky 
        steps={steps} 
        currentStep={currentStep} 
      />

      {/* Contenido del Formulario */}
      <div className="max-w-lg mx-auto p-4 pb-20">
        {/* Vista de Éxito */}
        {isSubmitted ? (
          <SuccessView />
        ) : (
          <form className="space-y-6">
          {/* Sección: Datos Personales */}
          {currentStep === 1 && (
            <FormSection title="Datos Personales">
              <TextInput
                name="nombre"
                label="Nombre"
                required
                value={formData.nombre}
                onChange={handleInputChange('nombre')}
                placeholder="Juan Carlos"
              />
              
              <TextInput
                name="apellido"
                label="Apellido Paterno"
                required
                value={formData.apellido}
                onChange={handleInputChange('apellido')}
                placeholder="Pérez"
              />
              
              <TextInput
                name="segundo_apellido"
                label="Apellido Materno"
                value={formData.segundo_apellido}
                onChange={handleInputChange('segundo_apellido')}
                placeholder="González"
              />
              
              <TextInput
                name="numero_documento"
                label="Número de Documento"
                required
                value={formData.numero_documento}
                onChange={handleInputChange('numero_documento')}
                placeholder="12345678"
              />
              
              <DatePickerMobile
                name="fecha_nacimiento"
                label="Fecha de Nacimiento"
                required
                value={formData.fecha_nacimiento}
                onChange={handleInputChange('fecha_nacimiento')}
              />
              
              <Select
                name="sexo"
                label="Sexo"
                required
                options={SEXOS}
                value={formData.sexo}
                onChange={handleInputChange('sexo')}
              />
              
              <Select
                name="estado_civil"
                label="Estado Civil"
                required
                options={ESTADOS_CIVIL}
                value={formData.estado_civil}
                onChange={handleInputChange('estado_civil')}
              />
              
              <CountrySelectISO
                name="pais_nacimiento"
                label="País de Nacimiento"
                required
                value={formData.pais_nacimiento}
                onChange={handleCountryChange}
              />
              
              <NavigationButtons
                currentStep={currentStep}
                totalSteps={7}
                isCurrentStepValid={isCurrentStepValid()}
                onPrevious={prevStep}
                onNext={nextStep}
              />
            </FormSection>
          )}

          {/* Sección: Contacto */}
          {currentStep === 2 && (
            <FormSection title="Datos de Contacto">
              <PhoneInputIntl
                name="telefono_particular"
                label="Teléfono Particular"
                required
                value={formData.telefono_particular}
                onChange={handlePhoneChange('telefono_particular')}
              />
              
              <EmailInput
                name="email_personal"
                label="Email Personal"
                required
                value={formData.email_personal}
                onChange={handleInputChange('email_personal')}
                placeholder="juan.perez@ejemplo.com"
              />
              
              <NavigationButtons
                currentStep={currentStep}
                totalSteps={7}
                isCurrentStepValid={isCurrentStepValid()}
                onPrevious={prevStep}
                onNext={nextStep}
              />
            </FormSection>
          )}

          {/* Sección: Dirección */}
          {currentStep === 3 && (
            <FormSection title="Dirección">
              <TextInput
                name="calle"
                label="Calle"
                required
                value={formData.calle}
                onChange={handleInputChange('calle')}
                placeholder="Av. Providencia"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <TextInput
                  name="numero_calle"
                  label="Número"
                  value={formData.numero_calle}
                  onChange={handleInputChange('numero_calle')}
                  placeholder="1234"
                />
                
                <TextInput
                  name="depto_oficina"
                  label="Dpto/Oficina"
                  value={formData.depto_oficina}
                  onChange={handleInputChange('depto_oficina')}
                  placeholder="Dpto 101"
                />
              </div>
              
              <CascadingRegionComuna
                regionName="ciudad"
                comunaName="comuna"
                required
                regionValue={formData.ciudad}
                comunaValue={formData.comuna}
                onRegionChange={handleRegionChange}
                onComunaChange={handleComunaChange}
              />
              
              <NavigationButtons
                currentStep={currentStep}
                totalSteps={7}
                isCurrentStepValid={isCurrentStepValid()}
                onPrevious={prevStep}
                onNext={nextStep}
              />
            </FormSection>
          )}

          {/* Sección: Contacto de Emergencia */}
          {currentStep === 4 && (
            <FormSection title="Contacto de Emergencia">
              <TextInput
                name="contacto_emergencia_nombre"
                label="Nombre de Contacto"
                required
                value={formData.contacto_emergencia_nombre}
                onChange={handleInputChange('contacto_emergencia_nombre')}
                placeholder="María Elena González"
              />
              
              <PhoneInputIntl
                name="contacto_emergencia_telefono"
                label="Teléfono de Contacto"
                required
                value={formData.contacto_emergencia_telefono}
                onChange={handlePhoneChange('contacto_emergencia_telefono')}
              />
              
              <NavigationButtons
                currentStep={currentStep}
                totalSteps={7}
                isCurrentStepValid={isCurrentStepValid()}
                onPrevious={prevStep}
                onNext={nextStep}
              />
            </FormSection>
          )}

          {/* Sección: Datos Bancarios */}
          {currentStep === 5 && (
            <FormSection title="Datos Bancarios">
              <Select
                name="banco"
                label="Banco"
                required
                options={BANCOS}
                value={formData.banco}
                onChange={handleInputChange('banco')}
              />
              
              <Select
                name="tipo_cuenta"
                label="Tipo de Cuenta"
                required
                options={TIPOS_CUENTA}
                value={formData.tipo_cuenta}
                onChange={handleInputChange('tipo_cuenta')}
              />
              
              <AccountNumberInput
                name="numero_cuenta"
                label="Número de Cuenta"
                required
                value={formData.numero_cuenta}
                onChange={handleInputChange('numero_cuenta')}
                bankFieldRef={formData.banco}
              />
              
              <NavigationButtons
                currentStep={currentStep}
                totalSteps={7}
                isCurrentStepValid={isCurrentStepValid()}
                onPrevious={prevStep}
                onNext={nextStep}
              />
            </FormSection>
          )}

          {/* Sección: Previsión */}
          {currentStep === 6 && (
            <FormSection title="Previsión">
              <Select
                name="fondo_cotizacion"
                label="AFP"
                required
                options={AFPS}
                value={formData.fondo_cotizacion}
                onChange={handleInputChange('fondo_cotizacion')}
              />
              
              <Select
                name="salud"
                label="Salud"
                required
                options={SALUD}
                value={formData.salud}
                onChange={handleInputChange('salud')}
              />
              
              <Select
                name="afc"
                label="AFC (Años de Cotización)"
                required
                options={AFC}
                value={formData.afc}
                onChange={handleInputChange('afc')}
              />
              
              <NavigationButtons
                currentStep={currentStep}
                totalSteps={7}
                isCurrentStepValid={isCurrentStepValid()}
                onPrevious={prevStep}
                onNext={nextStep}
              />
            </FormSection>
          )}

          {/* Sección: Tallas */}
          {currentStep === 7 && (
            <FormSection title="Tallas">
              <SizeSelect
                name="talla_superior"
                label="Talla Polera/Polerón"
                required
                options={TALLAS_SUPERIOR}
                value={formData.talla_superior}
                onChange={handleInputChange('talla_superior')}
              />
              
              <SizeSelect
                name="talla_inferior"
                label="Talla Pantalón"
                required
                options={TALLAS_INFERIOR}
                value={formData.talla_inferior}
                onChange={handleInputChange('talla_inferior')}
              />
              
              <SizeSelect
                name="talla_zapato"
                label="Talla de Zapato"
                required
                options={TALLAS_ZAPATO}
                value={formData.talla_zapato}
                onChange={handleInputChange('talla_zapato')}
              />
              
              <NavigationButtons
                currentStep={currentStep}
                totalSteps={7}
                isCurrentStepValid={isCurrentStepValid()}
                onPrevious={prevStep}
                onNext={nextStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </FormSection>
          )}
          </form>
        )}
      </div>
    </div>
  )
}