'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Used in case the browser doesn't support localStorage
 * @type {Object}
 */
var storage = {};
var localStorage = window.localStorage;

/**
 * Check if the browser has localStorage available
 * @return {Boolean}
 */
var hasLocalStorage = function hasLocalStorage() {
  var available = true;

  try {
    localStorage.setItem('0', '');
    localStorage.removeItem('0');
  } catch (e) {
    available = false;
  }

  return available;
};

/**
 * Stores the key value pair
 * @param {String}  key
 * @param {String}  value
 * @param {Boolean} permanent
 */
var setItem = exports.setItem = function setItem(key, value) {
  var permanent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (!hasLocalStorage() || !permanent) {
    storage[key] = value;
  }

  localStorage.setItem(key, value);
};

/**
 * Return the stored value
 * @type {String} key
 * @type {Boolean} parse
 * @return {any}
 */
var getItem = exports.getItem = function getItem(key) {
  var parse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!hasLocalStorage()) {
    return storage[key];
  }

  var item = localStorage.getItem(key) || storage[key];

  return item && parse ? JSON.parse(item) : item;
};

/**
 * Remove the store value
 * @param  {string} key
 */
var removeItem = exports.removeItem = function removeItem(key) {
  if (!hasLocalStorage) {
    if (!storage[key]) {
      return;
    }

    delete storage[key];

    return;
  }

  localStorage.removeItem(key);
};