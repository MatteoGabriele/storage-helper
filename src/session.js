/**
 * This will be our session storage in case of everything fails!
 * First will try to use localStorage, then cookies and if we can't write
 * that either, we're gonna store it here.
 * @type {Array}
 */
let storage = []

/**
 * Add item in out session storage
 * @param {String} key
 * @param {String} value
 */
const setItem = (key, value) => {
  storage[key] = typeof value === 'string' ? value : JSON.stringify(value)
}

/**
 * Return the item from out session storage
 * It will always returns a string so every data will be
 * treated like it comes from the localStorage.
 * @param  {String} key
 * @return {String}
 */
const getItem = (key) => {
  return storage[key] || null
}

const clear = () => {
  storage = []
}

/**
 * Remove item from the session storage
 * @param  {String}  key
 */
const removeItem = (key) => {
  if (!storage[key]) {
    return
  }

  delete storage[key]
}

export default { setItem, getItem, removeItem, clear }
