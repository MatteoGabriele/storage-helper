import session from './session'
import cookie from './cookie'
import { log } from './utils'
import { debug, setDebug } from './config'

/**
 * Checks if cookies are blocked.
 * With cookies are intended all types of browser storage:
 * localStorage, sessionStorage and cookies
 * In case of a false the plain object storing will kick in.
 * @type {Boolean}
 */
const isCookieEnabled = navigator && navigator.cookieEnabled

/**
 * Reference to the localStorage object
 * Apparently Safari doesn't want to even try to check if the localStorage
 * exists, so we're not gonna touch it if cookies are blocked in first place.
 * @type {LocalStorage}
 */
const localstorage = isCookieEnabled ? window.localStorage : undefined

/**
 * To avoid the try/catch to be called multiple times, the value
 * of the check is gonna be stored here.
 * @type {Boolean}
 */
let checker

/**
 * LocalStorage check
 * @return {Boolean}
 */
const hasLocalStorage = () => {
  if (!localstorage) {
    checker = false
  }

  if (typeof checker !== 'undefined') {
    return checker
  }

  try {
    localstorage.setItem('0', '')
    localstorage.removeItem('0')
    checker = true
  } catch (e) {
    checker = false
  }

  return checker
}

/**
 * Set the item.
 * Here data will be saved in the LocalStorage if it doesn't exist, otherwise we'll
 * try cookies and if we're not in a lucky day, data will be stored in a plain object.
 *
 * An extra check is done here for the QuotaExceededError.
 * I'll try to save data and just silently warning it
 * in the console, so also real-time error tracking tools won't stress too much.
 * @param {String}  key
 * @param {String}  value
 * @param {Boolean} [persistency=true]
 */
export const setItem = (key, value, persistency = true) => {
  if (!hasLocalStorage() || !persistency) {
    if (!persistency) {
      session.setItem(key, value)
      return
    }

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
 * Here the object is taken from the localStorage if it was available,
 * or from the object if wasn't possible or if simple wasn't saved permanently
 * @param  {String}  key
 * @param  {Boolean} [parsed=false]
 * @return {any}
 */
export const getItem = (key, parsed = false) => {
  const cookieItem = cookie.getItem(key)
  const sessionItem = session.getItem(key)

  let result

  if (!hasLocalStorage()) {
    result = cookieItem || sessionItem
  } else {
    result = localstorage.getItem(key) || cookieItem || sessionItem
  }

  try {
    return parsed ? JSON.parse(result) : result
  } catch (e) {
    if (parsed) {
      log(`Oops! Some problems parsing this ${typeof result}.`, 'error', debug)
    } else {
      log(e, 'error', debug)
    }
  }

  return null
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

export const showStorageLogger = (value) => {
  setDebug(!!value)
}

/**
 * Exports all features, so will be possible to use it as an object as well
 */
export default { setItem, getItem, removeItem, clear }
