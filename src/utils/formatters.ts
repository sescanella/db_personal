// Title Case: Primera letra mayúscula, resto minúscula por palabra
export const toTitleCase = (str: string): string => {
  return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}