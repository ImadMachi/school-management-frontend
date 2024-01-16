import axios from 'axios'
import auth from './auth'

axios.interceptors.request.use(
  config => {
    const authToken = localStorage.getItem(auth.storageTokenKeyName)

    if (authToken) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${authToken}`
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default axios
