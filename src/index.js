const isCookieEnabled = navigator && navigator.cookieEnabled

/**
 * Reference to the localStorage object
 * @type {LocalStorage}
 */
const localstorage = isCookieEnabled ? window.localStorage : undefined

/**
 * This will be our session storage in case of everything fails!
 * First will try to use localStorage, then cookies and if we can't write
 * that either, we're gonna store it here.
 * @type {Object}
 */
let sessionStorage = {}

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
  if (typeof checker !== 'undefined') {
    return checker
  }

  if (!localstorage) {
    return checker = false
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

const log = (text, type = 'success') => {
  const success = 'padding: 2px; background: #219621; color: #ffffff'
  const warning = 'padding: 2px; background: #f1e05a; color: #333333'
  const error = 'padding: 2px; background: #b9090b; color: #ffffff'
  const types = { error, success, warning }

  console.log(`%c [Storage Helper] ${text} `, types[type])
}

/**
 * Set the item.
 * An extra check is done here for the QuotaExceededError.
 * I'll just silently warning it in the console, so real-time error
 * tracking tools won't stress you too much! Been there, done that! :)
 * @param {String}  key
 * @param {String}  value
 * @param {Boolean} [persistency=true]
 */
export const setItem = (key, value, persistency = true) => {
  if (!hasLocalStorage() || !persistency) {
    if (!persistency) {
      setSessionItem(key, value)
      return
    }

    setCookie(key, value)
    return
  }

  try {
    localstorage.setItem(key, value)
  } catch (e) {
    const { code } = e

    if (code === 22 || code === 1014) {
      log(`Quota exceeded for "${key}"!`, 'error')

      // Let's try with cookies then!
      setCookie(key, value)
    }
  }
}

/**
 * Get the item
 * Here the object is taken from the localStorage if it was available,
 * or from the object if wasn't possible or if simple wasn't saved permanently
 * @param  {String}  key
 * @param  {Boolean} [parsed = false]
 * @return {any}
 */
export const getItem = (key, parsed = false) => {
  if (!hasLocalStorage()) {
    const cookie = getCookie(key)
    const item = cookie !== '' ? cookie : getSessionItem(key)

    return parsed ? JSON.parse(item) : item
  }

  const item = localstorage.getItem(key) || sessionStorage[key]

  return parsed ? JSON.parse(item) : item
}

/**
 * Clear all storage
 */
export const clear = () => {
  clearAllSessionItems()
  clearAllCookies()

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
  removeSessionItem(key)
  removeCookie(key)

  if (!hasLocalStorage()) {
    return
  }

  localstorage.removeItem(key)
}

const setCookie = (key, value, exdays = 1) => {
  if (window.navigator && !window.navigator.cookieEnabled) {
    setSessionItem(key, value)
    log(`I've saved "${key}" in a plain object :)`, 'warning')
    return
  }

  document.cookie = getCookieString(key, value, exdays)
  log(`I've saved "${key}" in a cookie :)`, 'warning')
}

const getCookieString = (key, value, exdays) => {
  const d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))

  const expires = `expires=${d.toUTCString()}`

  return `${key}=${value};${expires};path=/`
}

/**
 * Get value from a cookie
 * @param  {String} key
 * @return {String}
 */
const getCookie = (key) => {
  const name = `${key}=`
  const cookies = document.cookie.split(';')

  for (let i = 0, l = cookies.length; i < l; i++) {
    let cookie = cookies[i]

    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1)
    }

    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length)
    }
  }

  return ''
}

/**
 * Remove cookie
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
const removeCookie = (key) => {
  document.cookie = getCookieString(key, '', -10)
}

/**
 * Remove all cookies
 */
const clearAllCookies = () => {
  const cookies = document.cookie.split(';')

  if (!cookies.length) {
    return
  }

  for (let i = 0, l = cookies.length; i < l; i++) {
    const cookie = cookies[i]
    const cookiesName = cookie.split('=')[0]

    removeCookie(cookiesName)
  }
}

/**
 * Add item in out session storage
 * @param {String} key
 * @param {String} value
 */
const setSessionItem = (key, value) => {
  sessionStorage[key] = value
}

/**
 * Return the item from out session storage
 * It will always returns a string so every data will be
 * treated like it comes from the localStorage.
 * @param  {String} key
 * @return {String}
 */
const getSessionItem = (key) => {
  return JSON.stringify(sessionStorage[key] || '')
}

const clearAllSessionItems = () => {
  sessionStorage = {}
}

/**
 * Remove item from the session storage
 * @param  {String}  key
 */
const removeSessionItem = (key) => {
  if (!sessionStorage[key]) {
    return
  }

  delete sessionStorage[key]
}

/**
 * Exports all features, so will be possible to use it as an object as well
 */
export default { setItem, getItem, removeItem, clear }
