(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.removeItem = exports.clear = exports.getItem = exports.setItem = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _session = __webpack_require__(6);

	var _session2 = _interopRequireDefault(_session);

	var _cookie = __webpack_require__(7);

	var _cookie2 = _interopRequireDefault(_cookie);

	var _utils = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var isCookieEnabled = navigator && navigator.cookieEnabled;

	var localstorage = isCookieEnabled ? window.localStorage : undefined;

	var checker = void 0;

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

	var setItem = exports.setItem = function setItem(key, value) {
	  var persistency = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

	  if (!hasLocalStorage() || !persistency) {
	    if (!persistency) {
	      _session2.default.setItem(key, value);
	      return;
	    }

	    _cookie2.default.setItem(key, value);
	    return;
	  }

	  try {
	    localstorage.setItem(key, value);
	  } catch (e) {
	    var code = e.code;


	    if (code === 22 || code === 1014) {
	      (0, _utils.log)('Quota exceeded for "' + key + '"!', 'error');

	      _cookie2.default.setItem(key, value);
	    }
	  }
	};

	var getItem = exports.getItem = function getItem(key) {
	  var parsed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	  var cookieItem = _cookie2.default.getItem(key);
	  var sessionItem = _session2.default.getItem(key);

	  var result = void 0;

	  if (!hasLocalStorage()) {
	    result = cookieItem || sessionItem;
	  } else {
	    result = localstorage.getItem(key) || cookieItem || sessionItem;
	  }

	  try {
	    return parsed ? JSON.parse(result) : result;
	  } catch (e) {
	    if (parsed) {
	      (0, _utils.log)('Oops! Some problems parsing this ' + (typeof result === 'undefined' ? 'undefined' : _typeof(result)) + '.', 'error');
	    } else {
	      (0, _utils.log)(e, 'error');
	    }
	  }

	  return null;
	};

	var clear = exports.clear = function clear() {
	  _cookie2.default.clear();
	  _session2.default.clear();

	  if (!hasLocalStorage()) {
	    return;
	  }

	  localstorage.clear();
	};

	var removeItem = exports.removeItem = function removeItem(key) {
	  _cookie2.default.removeItem(key);
	  _session2.default.removeItem(key);

	  if (!hasLocalStorage()) {
	    return;
	  }

	  localstorage.removeItem(key);
	};

	exports.default = { setItem: setItem, getItem: getItem, removeItem: removeItem, clear: clear };

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var log = exports.log = function log(text) {
	  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'success';

	  var success = 'padding: 2px; background: #219621; color: #ffffff';
	  var warning = 'padding: 2px; background: #f1e05a; color: #333333';
	  var error = 'padding: 2px; background: #b9090b; color: #ffffff';
	  var types = { error: error, success: success, warning: warning };

	  console.log('%c [Storage Helper] ' + text + ' ', types[type]);
	};

	var getCookieString = exports.getCookieString = function getCookieString(key, value) {
	  var exdays = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

	  var date = new Date();
	  date.setTime(date.getTime() + exdays * 24 * 60 * 60 * 1000);

	  return key + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var storage = [];

	var setItem = function setItem(key, value) {
	  storage[key] = typeof value === 'string' ? value : JSON.stringify(value);
	};

	var getItem = function getItem(key) {
	  return storage[key] || null;
	};

	var clear = function clear() {
	  storage = [];
	};

	var removeItem = function removeItem(key) {
	  if (!storage[key]) {
	    return;
	  }

	  delete storage[key];
	};

	exports.default = { setItem: setItem, getItem: getItem, removeItem: removeItem, clear: clear };

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _session = __webpack_require__(6);

	var _session2 = _interopRequireDefault(_session);

	var _utils = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var setItem = function setItem(key, value) {
	  var exdays = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

	  if (window.navigator && !window.navigator.cookieEnabled) {
	    _session2.default.set(key, value);
	    (0, _utils.log)('I\'ve saved "' + key + '" in a plain object :)', 'warning');
	    return;
	  }

	  document.cookie = (0, _utils.getCookieString)(key, value, exdays);
	  (0, _utils.log)('I\'ve saved "' + key + '" in a cookie :)', 'warning');
	};

	var getItem = function getItem(key) {
	  var cookies = document.cookie.split(';');

	  for (var i = 0, l = cookies.length; i < l; i++) {
	    var cookie = cookies[i].trim();
	    var keyValuePair = cookie.split('=');

	    if (keyValuePair.indexOf(key) === -1) {
	      continue;
	    }

	    return keyValuePair[1];
	  }

	  return null;
	};

	var removeItem = function removeItem(key) {
	  document.cookie = (0, _utils.getCookieString)(key, '', -10);
	};

	var clear = function clear() {
	  var cookies = document.cookie.split(';');

	  if (!cookies.length) {
	    return;
	  }

	  for (var i = 0, l = cookies.length; i < l; i++) {
	    var cookie = cookies[i];
	    var cookiesName = cookie.split('=')[0];

	    removeItem(cookiesName);
	  }
	};

	exports.default = { setItem: setItem, getItem: getItem, removeItem: removeItem, clear: clear };

/***/ }
/******/ ])
});
;