'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var localstorage = window.localStorage;

var sessionStorage = {};

var checker = void 0;

var hasLocalStorage = function hasLocalStorage() {
  if (typeof checker !== 'undefined') {
    return checker;
  }

  if (!localstorage) {
    return checker = false;
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

var log = function log(text) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'success';

  var success = 'padding: 2px; background: #219621; color: #ffffff';
  var error = 'padding: 2px; background: #b9090b; color: #ffffff';
  var types = { error: error, success: success };

  console.log('%c [Storage Helper] ' + text + ' ', types[type]);
};

var setItem = exports.setItem = function setItem(key, value) {
  var persistency = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (!hasLocalStorage() || !persistency) {
    sessionStorage[key] = value;
    return;
  }

  try {
    localstorage.setItem(key, value);
  } catch (e) {
    var code = e.code;

    if (code === 22 || code === 1014) {
      log('Quota exceeded!', 'error');
      log('I\'ve saved that in the session storage :)', 'success');

      sessionStorage[key] = value;
    }
  }
};

var getItem = exports.getItem = function getItem(key) {
  var parsed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!hasLocalStorage()) {
    return parsed ? sessionStorage[key] : JSON.stringify(sessionStorage[key]);
  }

  var item = localstorage.getItem(key) || sessionStorage[key];

  return parsed ? JSON.parse(item) : item;
};

var clear = exports.clear = function clear() {
  if (!hasLocalStorage()) {
    sessionStorage = {};
    return;
  }

  sessionStorage = {};
  localstorage.clear();
};

var removeItem = exports.removeItem = function removeItem(key) {
  if (!hasLocalStorage()) {
    removeSessionItem(key);
    return;
  }

  removeSessionItem(key);
  localstorage.removeItem(key);
};

var removeSessionItem = function removeSessionItem(key) {
  if (!sessionStorage[key]) {
    return;
  }

  delete sessionStorage[key];
};

exports.default = { setItem: setItem, getItem: getItem, removeItem: removeItem, clear: clear };