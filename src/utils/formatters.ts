// Title Case: Primera letra mayúscula, resto minúscula por palabra
export const toTitleCase = (str: string): string => {
  return str.toLowerCase().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}