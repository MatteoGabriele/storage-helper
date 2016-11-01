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
