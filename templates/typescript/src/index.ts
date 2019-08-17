
export const greet = (name?: string) => {
  name = name || 'World'
  return `Hello, ${name}`
}