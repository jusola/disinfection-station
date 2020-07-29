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

  recover = async (code, location) => {
    try {
      store.addLoading(1)
      if (!code || !location) throw new errors.QueryError('Input valid code', 'error.recover.invalidquery')
      await net.recover(code, location)
      store.addLoading(-1)
      router.push('/configure')
    } catch (err) {
      this.showError(err)
      store.addLoading(-1)
    }
  }

  configure = async (username, password) => {
    try {
      store.addLoading(1)
      if (!username || !password) throw new errors.QueryError('Input both password and username', 'error.configure.invalidquery')
      await net.configure(username, password)
      store.addLoading(-1)
      router.push('/main')
    } catch (err) {
      if (err.type === 'CredentialError') {
        router.push('/login')
      }
      this.showError(err)
      store.addLoading(-1)
    }
  }

  getScores = async () => {
    try {
      const scores = await net.getScores()
      store.setScores(scores)
    } catch (err) {
      this.showError(err)
    }
  }

  getVisits = async () => {
    try {
      var visits = await net.getVisits()
      var visitsToday = 0
      var visitsThisWeek = 0
      const locale = vue.$i18n.locale
      visits.forEach((elem, index) => {
        if (elem.time > Date.now() - 1000 * 60 * 60 * 24) {
          visitsToday++
        }
        if (elem.time > Date.now() - 1000 * 60 * 60 * 24 * 7) {
          visitsThisWeek++
        }
        elem.time = new Date(elem.time).toLocaleString(locale)
        console.log(elem.time)
        this[index] = elem
      }, visits)
      store.setVisits(visits)
      store.setVisitsToday(visitsToday)
      store.setVisitsThisWeek(visitsThisWeek)
    } catch (err) {
      this.showError(err)
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
