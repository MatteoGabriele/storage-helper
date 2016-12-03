/*!
 * storage-helper v1.3.6
 * (c) 2016 Matteo Gabriele
 * Released under the ISC License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var cookie = _interopDefault(require('js-cookie'));

/**
 * This will be our session storage in case of everything fails!
 * First will try to use localStorage, then cookies and if we can't write
 * that either, we're gonna store it here.
 * @type {Array}
 */
var storage = [];

/**
 * Add item in out session storage
 * @param {String} key
 * @param {String} value
 */
var setItem$1 = function setItem$1(key, value) {
  storage[key] = typeof value === 'string' ? value : JSON.stringify(value);
};

/**
 * Return the item from out session storage
 * It will always returns a string so every data will be
 * treated like it comes from the localStorage.
 * @param  {String} key
 * @return {String}
 */
var getItem$1 = function getItem$1(key) {
  return storage[key] || null;
};

var clear$1 = function clear$1() {
  storage = [];
};

/**
 * Remove item from the session storage
 * @param  {String}  key
 */
var removeItem$1 = function removeItem$1(key) {
  if (!storage[key]) {
    return;
  }

  delete storage[key];
};

var session = { setItem: setItem$1, getItem: getItem$1, removeItem: removeItem$1, clear: clear$1 };

var debug = false;

var setDebug = function setDebug(value) {
  debug = value;
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





















var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

/**
 * Logger for different type of messages.
 * @param  {String} text
 * @param  {String} [type='success']
 */
var log = function log(text) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'success';
  var debug$$1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (!debug$$1) {
    return;
  }

  var success = 'padding: 2px; background: #219621; color: #ffffff';
  var warning = 'padding: 2px; background: #f1e05a; color: #333333';
  var error = 'padding: 2px; background: #b9090b; color: #ffffff';
  var types = { error: error, success: success, warning: warning };

  console.log('%c [Storage Helper] ' + text + ' ', types[type]);
};

/**
 * JSON parse with error
 * @param  {String} data
 * @return {String|null}
 */
var parse = function parse(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    log('Oops! Some problems parsing this ' + (typeof data === 'undefined' ? 'undefined' : _typeof(data)) + '.', 'error', debug);
  }

  return null;
};

/**
 * Checks if running a browser environment
 * @type {Boolean}
 */
var isBrowser = typeof window !== 'undefined';

/**
 * Checks if cookies are blocked.
 * With cookies are intended all types of browser storage:
 * localStorage, sessionStorage and cookies
 * In case of a false the plain object storing will kick in.
 * @type {Boolean}
 */
var isCookieEnabled = isBrowser && navigator && navigator.cookieEnabled;

/**
 * Set the item in the cookies if possible, otherwise is going to store it
 * inside a plain object
 * @param {String} key
 * @param {String} value
 * @param {Number} [expires=1]
 */
var setItem$2 = function setItem$2(key, value) {
  var expires = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  if (!isCookieEnabled) {
    session.setItem(key, value);
    log('I\'ve saved "' + key + '" in a plain object :)', 'warning', debug);
    return;
  }

  cookie.set(key, value, { expires: expires });
  log('I\'ve saved "' + key + '" in a cookie :)', 'warning', debug);
};

/**
 * Get value from a cookie
 * @param  {String} key
 * @return {String}
 */
var getItem$2 = function getItem$2(key) {
  return cookie.get(key);
};

/**
 * Remove cookie
 * @param  {String} key [description]
 */
var removeItem$2 = function removeItem$2(key) {
  cookie.remove(key);
};

/**
 * Remove all cookies
 */
var clear$2 = function clear$2() {
  var cookies = isBrowser && document.cookie.split(';');

  if (!cookies.length) {
    return;
  }

  for (var i = 0, l = cookies.length; i < l; i++) {
    var item = cookies[i];
    var key = item.split('=')[0];

    cookie.remove(key);
  }
};

var cookie$1 = { setItem: setItem$2, getItem: getItem$2, removeItem: removeItem$2, clear: clear$2 };

/**
 * Reference to the localStorage object
 * Apparently Safari doesn't want to even try to check if the localStorage
 * exists, so we're not gonna touch it if cookies are blocked in first place.
 * @type {LocalStorage}
 */
var localstorage = isCookieEnabled ? window.localStorage : undefined;

/**
 * To avoid the try/catch to be called multiple times, the value
 * of the check is gonna be stored here.
 * @type {Boolean}
 */
var checker = void 0;

/**
 * LocalStorage check
 * @return {Boolean}
 */
var hasLocalStorage = function hasLocalStorage() {
  if (!localstorage) {
    checker = false;
  }

  if (typeof checker !== 'undefined') {
    return checker;
  }

  try {
    localstorage.setItem('0', '');
    localstorage.removeItem('0');
    checker = true;
  } catch (e) {
    checker = false;
  }

  return checker;
};

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
var setItem = function setItem(key, value) {
  var persistency = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (!persistency) {
    session.setItem(key, value);
    return;
  }

  if (!hasLocalStorage()) {
    cookie$1.setItem(key, value);
    return;
  }

  try {
    localstorage.setItem(key, value);
  } catch (e) {
    var code = e.code;


    if (code === 22 || code === 1014) {
      log('Quota exceeded for "' + key + '"!', 'error', debug);

      // Let's try with cookies then!
      cookie$1.setItem(key, value);
    }
  }
};

/**
 * Get the item
 * Here the object is taken from the localStorage if it was available,
 * or from the object if wasn't possible or if simple wasn't saved permanently
 * @param  {String}  key
 * @param  {Boolean} [parsed=false]
 * @return {any}
 */
var getItem = function getItem(key) {
  var parsed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var result = void 0;

  var cookieItem = cookie$1.getItem(key);
  var sessionItem = session.getItem(key);

  if (!hasLocalStorage()) {
    result = cookieItem || sessionItem;
  } else {
    result = localstorage.getItem(key) || cookieItem || sessionItem;
  }

  return parsed ? parse(result) : result;
};

/**
 * Clear all storage
 */
var clear = function clear() {
  cookie$1.clear();
  session.clear();

  if (!hasLocalStorage()) {
    return;
  }

  localstorage.clear();
};

/**
 * Remove a single item from the storage
 * @param  {String}  key
 */
var removeItem = function removeItem(key) {
  cookie$1.removeItem(key);
  session.removeItem(key);

  if (!hasLocalStorage()) {
    return;
  }

  localstorage.removeItem(key);
};

var showStorageLogger = function showStorageLogger(value) {
  setDebug(!!value);
};

/**
 * Exports all features, so will be possible to use it as an object as well
 */
var index = { setItem: setItem, getItem: getItem, removeItem: removeItem, clear: clear };

exports.setItem = setItem;
exports.getItem = getItem;
exports.clear = clear;
exports.removeItem = removeItem;
exports.showStorageLogger = showStorageLogger;
exports['default'] = index;
