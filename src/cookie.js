import session from './session'
import jsCookie from 'js-cookie'
import { log } from './utils'

const setItem = (key, value, expires = 1) => {
  if (window.navigator && !window.navigator.cookieEnabled) {
    session.set(key, value)
    log(`I've saved "${key}" in a plain object :)`, 'warning')
    return
  }

  jsCookie.set(key, value, { expires })
  log(`I've saved "${key}" in a cookie :)`, 'warning')
}

/**
 * Get value from a cookie
 * @param  {String} key
 * @return {String}
 */
const getItem = (key) => {
  return jsCookie.get(key)
}

/**
 * Remove cookie
 * @param  {String} key [description]
 */
const removeItem = (key) => {
  jsCookie.remove(key)
}

/**
 * Remove all cookies
 */
const clear = () => {
  const cookies = document.cookie.split(';')

  if (!cookies.length) {
    return
  }

  for (let i = 0, l = cookies.length; i < l; i++) {
    const cookie = cookies[i]
    const key = cookie.split('=')[0]

    jsCookie.remove(key)
  }
}

export default { setItem, getItem, removeItem, clear }
