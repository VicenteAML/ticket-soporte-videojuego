export default defineNuxtRouteMiddleware(() => {
  const token = localStorage.getItem('accessToken')
  if (!token) return navigateTo('/login')
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.rol !== 'superadmin') return navigateTo('/dashboard')
  } catch {
    return navigateTo('/login')
  }
})
