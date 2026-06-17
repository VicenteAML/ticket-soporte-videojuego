export const useAuth = () => {
  const config = useRuntimeConfig()
  const API = config.public.apiBase

  const getToken = () => localStorage.getItem('accessToken')
  const getRefreshToken = () => localStorage.getItem('refreshToken')

  const setTokens = (access, refresh) => {
    localStorage.setItem('accessToken', access)
    localStorage.setItem('refreshToken', refresh)
  }

  const clearTokens = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  const getPayload = () => {
    const token = getToken()
    if (!token) return null
    try { return JSON.parse(atob(token.split('.')[1])) }
    catch { return null }
  }

  const apiFetch = (url, opts = {}) => {
    const token = getToken()
    const headers = { ...(opts.headers || {}) }
    if (token) headers['Authorization'] = 'Bearer ' + token
    let body = opts.body
    if (body && typeof body === 'object' && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(body)
    }
    return fetch(API + url, { ...opts, headers, body })
  }

  const logout = async () => {
    const refreshToken = getRefreshToken()
    try {
      await apiFetch('/auth/logout', { method: 'POST', body: { refreshToken } })
    } catch {}
    clearTokens()
    navigateTo('/login')
  }

  return { getToken, getRefreshToken, setTokens, clearTokens, getPayload, apiFetch, logout }
}
