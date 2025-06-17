import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
  return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

class AuthService {
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password });
      // Extract token from the correct place
      const result = response.data.result;
      const token = result && result.token;
      if (!token || typeof token !== 'string') {
        throw new Error('No token received');
      }

      // Store user data as needed
      const userData = {
        token: token,
        username: result.username,
        email: result.email,
        roles: result.roles,
        id: result.id,
        type: result.type
      };
      localStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return userData;
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message)
      throw error
    }
  }

  logout() {
    localStorage.removeItem('user')
    // Remove the token from axios default headers
    delete api.defaults.headers.common['Authorization']
    window.location.href = '/login'
  }

  getCurrentUser() {
    try {
      const user = localStorage.getItem('user')
      if (!user) {
        console.log('No user found in localStorage')
        return null
      }
      const parsedUser = JSON.parse(user)
      console.log('Current user from localStorage:', parsedUser)
      
      // Ensure the token is set in axios headers
      if (parsedUser?.token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`
      }
      
      return parsedUser
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  isAuthenticated() {
    const user = this.getCurrentUser()
    const isAuth = !!user && !!user.token
    console.log('Authentication status:', isAuth, 'User:', user)
    return isAuth
  }

  getAuthHeader() {
    const user = this.getCurrentUser()
    if (user?.token) {
      return { Authorization: `Bearer ${user.token}` }
    }
    return {}
  }
}

// Initialize auth state
const authService = new AuthService()
const user = authService.getCurrentUser()
if (user?.token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
}

export { authService, api } 