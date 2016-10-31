'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isCookieEnabled = navigator && navigator.cookieEnabled;

var localstorage = isCookieEnabled ? window.localStorage : undefined;

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
  var warning = 'padding: 2px; background: #f1e05a; color: #333333';
  var error = 'padding: 2px; background: #b9090b; color: #ffffff';
  var types = { error: error, success: success, warning: warning };

  console.log('%c [Storage Helper] ' + text + ' ', types[type]);
};

var setItem = exports.setItem = function setItem(key, value) {
  var persistency = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (!hasLocalStorage() || !persistency) {
    if (!persistency) {
      setSessionItem(key, value);
      return;
    }

    setCookie(key, value);
    return;
  }

  try {
    localstorage.setItem(key, value);
  } catch (e) {
    var code = e.code;


    if (code === 22 || code === 1014) {
      log('Quota exceeded for "' + key + '"!', 'error');

      setCookie(key, value);
    }
  }
};

var getItem = exports.getItem = function getItem(key) {
  if (!hasLocalStorage()) {
    return getCookie(key) || getSessionItem(key);
  }

  var item = localstorage.getItem(key) || sessionStorage[key];

  return parsed ? JSON.parse(item) : item;
};

var clear = exports.clear = function clear() {
  clearAllSessionItems();
  clearAllCookies();

  if (!hasLocalStorage()) {
    return;
  }

  localstorage.clear();
};

var removeItem = exports.removeItem = function removeItem(key) {
  removeSessionItem(key);
  removeCookie(key);

  if (!hasLocalStorage()) {
    return;
  }

  localstorage.removeItem(key);
};

var setCookie = function setCookie(key, value) {
  var exdays = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  if (window.navigator && !window.navigator.cookieEnabled) {
    setSessionItem(key, value);
    log('I\'ve saved "' + key + '" in a plain object :)', 'warning');
    return;
  }

  document.cookie = getCookieString(key, value, exdays);
  log('I\'ve saved "' + key + '" in a cookie :)', 'warning');
};

var getCookieString = function getCookieString(key, value, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);

  var expires = 'expires=' + d.toUTCString();

  return key + '=' + value + ';' + expires + ';path=/';
};

var getCookie = function getCookie(key) {
  var name = key + '=';
  var cookies = document.cookie.split(';');

  for (var i = 0, l = cookies.length; i < l; i++) {
    var cookie = cookies[i];

    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }

    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }

  return null;
};

var removeCookie = function removeCookie(key) {
  document.cookie = getCookieString(key, '', -10);
};

var clearAllCookies = function clearAllCookies() {
  var cookies = document.cookie.split(';');

  if (!cookies.length) {
    return;
  }

  for (var i = 0, l = cookies.length; i < l; i++) {
    var cookie = cookies[i];
    var cookiesName = cookie.split('=')[0];

    removeCookie(cookiesName);
  }
};

var setSessionItem = function setSessionItem(key, value) {
  sessionStorage[key] = value;
};

var getSessionItem = function getSessionItem(key) {
  var item = sessionStorage[key];
  return item ? JSON.stringify(item) : null;
};

var clearAllSessionItems = function clearAllSessionItems() {
  sessionStorage = {};
};

var removeSessionItem = function removeSessionItem(key) {
  if (!sessionStorage[key]) {
    return;
  }

  delete sessionStorage[key];
};

exports.default = { setItem: setItem, getItem: getItem, removeItem: removeItem, clear: clear };
