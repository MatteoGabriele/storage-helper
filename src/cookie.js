import session from './session'
import { getCookieString, log } from './utils'

const setItem = (key, value, exdays = 1) => {
  if (window.navigator && !window.navigator.cookieEnabled) {
    session.set(key, value)
    log(`I've saved "${key}" in a plain object :)`, 'warning')
    return
  }

  document.cookie = getCookieString(key, value, exdays)
  log(`I've saved "${key}" in a cookie :)`, 'warning')
}

/**
 * Get value from a cookie
 * @param  {String} key
 * @return {String}
 */
const getItem = (key) => {
  const cookies = document.cookie.split(';')

  for (let i = 0, l = cookies.length; i < l; i++) {
    const cookie = cookies[i].trim()
    const keyValuePair = cookie.split('=')

    if (keyValuePair.indexOf(key) === -1) {
      continue
    }

    return keyValuePair[1]
  }

  return null
}

/**
 * Remove cookie
 * @param  {String} key [description]
 */
const removeItem = (key) => {
  document.cookie = getCookieString(key, '', -10)
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
    const cookiesName = cookie.split('=')[0]

    removeItem(cookiesName)
  }
}

export default { setItem, getItem, removeItem, clear }
