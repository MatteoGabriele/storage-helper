import session from './session'
import cookie from './cookie'
import { log, isCookieEnabled, parse } from './utils'
import { debug, setDebug } from './config'

/**
 * Reference to the localStorage object
 * Apparently Safari doesn't want to even try to check if the localStorage
 * exists, so we're not gonna touch it if cookies are blocked in first place.
 * @type {LocalStorage}
 */
const localstorage = isCookieEnabled ? window.localStorage : undefined

/**
 * Check if the browser has localStorage
 * @return {Boolean}
 */
const hasLocalStorage = function () {
  if (!localstorage) {
    return false
  }

  try {
    localstorage.setItem('0', '')
    localstorage.removeItem('0')
    return true
  } catch (error) {
    return false
  }
}

/**
 * Set the item.
 * Here data will be saved...in a way or another:
 * 1) localStorage
 * 2) cookies
 * 3) plain object
 *
 * An extra check is done here for the QuotaExceededError.
 * I'll try to save data and just silently warning it
 * in the console, so also real-time error tracking tools won't stress too much.
 * @param {String}  key
 * @param {String}  value
 * @param {Boolean} [persistency=true]
 */
export const setItem = (key, value, persistency = true) => {
  if (!persistency) {
    session.setItem(key, value)
    return
  }

  if (!hasLocalStorage()) {
    cookie.setItem(key, value)
    return
  }

  try {
    localstorage.setItem(key, value)
  } catch (e) {
    const { code } = e

    if (code === 22 || code === 1014) {
      log(`Quota exceeded for "${key}"!`, 'error', debug)

      // Let's try with cookies then!
      cookie.setItem(key, value)
    }
  }
}

/**
 * Get the item
 * Here the object is taken from the localStorage, if it was available, or from the object
 * @param  {String}  key
 * @param  {Boolean} [parsed=false]
 * @return {any}
 */
export const getItem = (key, parsed = false, fallbackValue) => {
  let result

  const cookieItem = cookie.getItem(key)
  const sessionItem = session.getItem(key)

  if (!hasLocalStorage()) {
    result = cookieItem || sessionItem
  } else {
    result = localstorage.getItem(key) || cookieItem || sessionItem
  }

  const item = parsed ? parse(result) : result

  if ((typeof item === 'undefined' || item === null) && typeof fallbackValue !== 'undefined') {
    return fallbackValue
  }

  return item
}

/**
 * Clear all storage
 */
export const clear = () => {
  cookie.clear()
  session.clear()

  if (!hasLocalStorage()) {
    return
  }

  localstorage.clear()
}

/**
 * Remove a single item from the storage
 * @param  {String}  key
 */
export const removeItem = (key) => {
  cookie.removeItem(key)
  session.removeItem(key)

  if (!hasLocalStorage()) {
    return
  }

  localstorage.removeItem(key)
}

/**
 * Show/hide debug messages
 * @param  {Boolean} value
 */
export const showStorageLogger = (value) => {
  setDebug(!!value)
}

export default { setItem, getItem, removeItem, clear }
