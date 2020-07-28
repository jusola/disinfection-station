import jwtDecode from 'jwt-decode'
import axios from 'axios'
import errors from '@/modules/errors'

const server = process.env.VUE_APP_API_SERVER

class Net {
  constructor () {
    this.server = server
    console.log(server)
  }

  login = async (username, password) => {
    if (username && password) {
      const res = await this.post('/login', {
        data: {
          username: username,
          password: password
        }
      })
      const data = res.data
      if (data.success) {
        this.setToken(data.token)
      } else {
        throw errors.makeError(data.error.type, data.error.message, data.error.translationKey)
      }
    } else {
      throw new errors.QueryError('Username or password missing', 'login.error.invalidquery')
    }
  }

  recover = async (code) => {
    if (code) {
      const res = await this.post('/recover', {
        data: {
          code: code
        }
      })
      const data = res.data
      if (data.success) {
        this.setToken(data.token)
      } else {
        throw errors.makeError(data.error.type, data.error.message, data.error.translationKey)
      }
    }
  }

  configure = async (username, password) => {
    if (!username || !password) throw new errors.QueryError('Invalid query', 'configure.error.invalidquery')
    if (this.isLoggedIn()) {
      const res = await this.post('/configure', {
        data: {
          username: username,
          password: password
        }
      })
      const data = res.data
      if (!data.success) {
        throw errors.makeError(data.error.type, data.error.message, data.error.translationKey)
      }
    } else {
      throw new errors.CredentialError('No token', 'configure.error.notoken')
    }
  }

  getToken = () => {
    return localStorage.getItem('token')
  }

  setToken = newToken => {
    if (newToken) {
      return localStorage.setItem('token', newToken)
    } else {
      return localStorage.removeItem('token')
    }
  }

  isLoggedIn = () => {
    const token = this.getToken()
    if (token && !this.isExpired(token)) {
      return true
    } else {
      return false
    }
  }

  getUserID = () => {
    const token = this.getToken()
    const decodedJWT = jwtDecode(token)
    return decodedJWT.userid
  }

  logout = () => {
    this.setToken(null)
    return true
  }

  isExpired = token => {
    const decodedJWT = jwtDecode(token)
    return decodedJWT.exp < Date.now() / 1000
  }

  post = async (apiAddress, options) => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
    if (this.isLoggedIn()) {
      headers.Authorization = 'Bearer ' + this.getToken()
    }
    try {
      const res = await axios({
        baseURL: this.server,
        method: 'post',
        url: apiAddress,
        headers: headers,
        ...options
      })
      return res
    } catch (error) {
      console.error(error)
      throw new errors.NetworkError('Network error: ' + error.toString(), 'error.networkerror')
    }
  }

  get = async (apiAddress, options) => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
    if (this.isLoggedIn()) {
      headers.Authorization = 'Bearer ' + this.getToken()
    }
    try {
      const res = await axios({
        baseURL: this.server,
        method: 'get',
        url: apiAddress,
        headers: headers,
        ...options
      })
      return res
    } catch (error) {
      console.error(error)
      throw new errors.NetworkError('Network error: ' + error.toString(), 'error.networkerror')
    }
  }
}

export default new Net()
