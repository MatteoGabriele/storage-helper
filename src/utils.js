/**
 * Logger for different type of messages.
 * @param  {String} text
 * @param  {String} [type='success']
 */
export const log = (text, type = 'success') => {
  const success = 'padding: 2px; background: #219621; color: #ffffff'
  const warning = 'padding: 2px; background: #f1e05a; color: #333333'
  const error = 'padding: 2px; background: #b9090b; color: #ffffff'
  const types = { error, success, warning }

  console.log(`%c [Storage Helper] ${text} `, types[type])
}

/**
 * It creates a cookie string based on key, value and expiring date
 * @param  {String} key
 * @param  {String} value
 * @param  {Number} exdays
 * @return {String}
 */
export const getCookieString = (key, value, exdays = 1) => {
  const date = new Date()
  date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000))

  return `${key}=${value};expires=${date.toUTCString()};path=/`
}
