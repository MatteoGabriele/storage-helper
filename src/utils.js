import { debug } from './config'

/**
 * Logger for different type of messages.
 * @param  {String} text
 * @param  {String} [type='success']
 */
export const log = (text, type = 'success', debug = false) => {
  if (!debug) {
    return
  }

  const success = 'padding: 2px; background: #219621; color: #ffffff'
  const warning = 'padding: 2px; background: #f1e05a; color: #333333'
  const error = 'padding: 2px; background: #b9090b; color: #ffffff'
  const types = { error, success, warning }

  console.log(`%c [Storage Helper] ${text} `, types[type])
}

/**
 * JSON parse with error
 * @param  {String} data
 * @return {String|null}
 */
export const parse = (data) => {
  try {
    return JSON.parse(data)
  } catch (e) {
    log(`Oops! Some problems parsing this ${typeof data}.`, 'error', debug)
  }

  return null
}

/**
 * Checks if we are in a browser
 * @type {Boolean}
 */
export const isBrowser = typeof window !== 'undefined'

/**
 * Checks if cookies are blocked.
 * With cookies are intended all types of browser storage:
 * localStorage, sessionStorage and cookies
 * In case of a false the plain object storing will kick in.
 * @type {Boolean}
 */
export const isCookieEnabled = isBrowser && navigator && navigator.cookieEnabled
