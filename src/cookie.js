import session from './session'
import cookie from 'js-cookie'
import { log, isCookieEnabled, isBrowser } from './utils'
import { debug } from './config'

/**
 * Set the item in the cookies if possible, otherwise is going to store it
 * inside a plain object
 * @param {String} key
 * @param {String} value
 * @param {Number} [expires=1]
 */
const setItem = (key, value, expires = 1) => {
  if (!isCookieEnabled) {
    session.setItem(key, value)
    log(`I've saved "${key}" in a plain object :)`, 'warning', debug)
    return
  }

  cookie.set(key, value, { expires })
  log(`I've saved "${key}" in a cookie :)`, 'warning', debug)
}

/**
 * Get value from a cookie
 * @param  {String} key
 * @return {String}
 */
const getItem = (key) => {
  return cookie.get(key)
}

/**
 * Remove cookie
 * @param  {String} key [description]
 */
const removeItem = (key) => {
  cookie.remove(key)
}

/**
 * Remove all cookies
 */
const clear = () => {
  const cookies = isBrowser && document.cookie.split(';')

  if (!cookies.length) {
    return
  }

  for (let i = 0, l = cookies.length; i < l; i++) {
    const item = cookies[i]
    const key = item.split('=')[0]

    cookie.remove(key)
  }
}

export default { setItem, getItem, removeItem, clear }
