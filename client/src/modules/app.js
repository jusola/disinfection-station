import vue from '@/main'

import net from '@/modules/net'
import store from '@/modules/store'
import router from '@/router'
import errors from '@/modules/errors'

import { ToastProgrammatic as Toast } from 'buefy'

class App {
  constructor () {
    this.warnConsolePasting()
  }

  warnConsolePasting = () => {
    console.warn('%cSTOP!', 'color:#000;background-color:#faa;font-size:20em')
    console.warn('%cThe developer tools are intended for developers. If you have been told by someone to paste or type anything here, there is a 200% chance that they\'re trying to scam you.', 'color: #000; font-size:x-large;')
    console.warn('%cTo stay safe, close this side-bar. ', 'color:#000;font-size:xx-large;')
    console.warn('%cIf you want to learn more, visit https://en.wikipedia.org/wiki/Self-XSS', 'color: #6; font-size:large;')
  }

  login = async (username, password) => {
    try {
      store.addLoading(1)
      if (!username || !password) {
        throw new errors.QueryError('Input both password and username', 'error.login.invalidquery')
      }
      await net.login(username, password)
      store.addLoading(-1)
      router.push('/')
    } catch (err) {
      this.showError(err)
      store.addLoading(-1)
    }
  }

  recover = async (code) => {
    try {
      store.addLoading(1)
      if (!code) throw new errors.QueryError('Input valid code', 'error.recover.invalidquery')
      await net.recover(code)
      store.addLoading(-1)
      router.push('/configure')
    } catch (err) {
      this.showError(err)
      store.addLoading(-1)
    }
  }

  logout = async () => {
    net.logout() // clear user token
    router.push('/') // go to login
  }

  showError = (error) => {
    error = error.toString()
    const msg = vue.$t(error)
    Toast.open({
      message: msg,
      type: 'is-danger',
      duration: 5000,
      queue: false
    })
  }
}

export default new App()
