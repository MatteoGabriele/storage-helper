/**
 * Reference to the localStorage object
 * @type {LocalStorage}
 */
const localstorage = window.localStorage

/**
 * This will be our session storage in case of the localStorage is
 * not available.
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
  const error = 'padding: 2px; background: #b9090b; color: #ffffff'
  const types = { error, success }

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
    sessionStorage[key] = value
    return
  }

  try {
    localstorage.setItem(key, value)
  } catch (e) {
    const { code } = e
    if (code === 22 || code === 1014) {
      log('Quota exceeded!', 'error')
      log('I\'ve saved that in the session storage :)', 'success')

      // Saving it anyway in the session storage
      sessionStorage[key] = value
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
    /**
     * Even though we saved it in our session storage, so it's actually
     * always a primitive, we are going to treat it like a string from
     * the localStorage because you don't know where it was stored.
     */
    return parsed ? sessionStorage[key] : JSON.stringify(sessionStorage[key])
  }

  const item = localstorage.getItem(key) || sessionStorage[key]

  return parsed ? JSON.parse(item) : item
}

/**
 * Clear all storage
 */
export const clear = () => {
  if (!hasLocalStorage()) {
    sessionStorage = {}
    return
  }

  sessionStorage = {}
  localstorage.clear()
}

/**
 * Remove a single item from the storage
 * @param  {String}  key
 */
export const removeItem = (key) => {
  if (!hasLocalStorage()) {
    removeSessionItem(key)
    return
  }

  removeSessionItem(key)
  localstorage.removeItem(key)
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
