export const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

export function fullName(nombre: string, apellido: string, segundoApellido?: string): string {
  const parts = [nombre, apellido];
  if (segundoApellido?.trim()) {
    parts.push(segundoApellido);
  }
  return parts.join(' ');
}

export function formatRUT(numeroDocumento: string): string {
  if (!numeroDocumento) return '';
  
  // Only format if it's purely numeric or ends with K, and between 8-9 characters
  const isValidFormat = /^(\d+|\d+[kK])$/.test(numeroDocumento);
  const isValidLength = numeroDocumento.length >= 8 && numeroDocumento.length <= 9;
  
  if (!isValidFormat || !isValidLength) {
    return `EXT: ${numeroDocumento}`;
  }
  
  const cleaned = numeroDocumento.replace(/[^\dkK]/g, '');
  if (cleaned.length < 2) return `EXT: ${numeroDocumento}`;
  
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  
  // Check if the first 1-2 digits are between 1 and 35
  const firstTwoDigits = parseInt(body.substring(0, 2), 10);
  if (firstTwoDigits < 1 || firstTwoDigits > 35) {
    return `EXT: ${numeroDocumento}`;
  }
  
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `RUT: ${formatted}-${dv}`;
}

export function edadFrom(fechaNacimiento: string): number {
  if (!fechaNacimiento) return 0;
  
  const birth = new Date(fechaNacimiento);
  const today = new Date();
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return Math.max(0, age);
}

export function formatPhoneCL(phoneNumber: string): string {
  if (!phoneNumber) return '';
  
  if (phoneNumber.startsWith('+56')) {
    const digits = phoneNumber.slice(3);
    if (digits.length === 9 && digits.startsWith('9')) {
      return `+56 9 ${digits.slice(1, 5)} ${digits.slice(5)}`;
    }
    if (digits.length === 8) {
      return `+56 2 ${digits.slice(0, 4)} ${digits.slice(4)}`;
    }
    return phoneNumber;
  }
  
  const cleanedNumber = phoneNumber.replace(/\D/g, '');
  
  if (cleanedNumber.length === 9 && cleanedNumber.startsWith('9')) {
    return `+56 9 ${cleanedNumber.slice(1, 5)} ${cleanedNumber.slice(5)}`;
  }
  
  return `Ext: ${phoneNumber}`;
}

export function formatDateCL(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Santiago'
  });
}
