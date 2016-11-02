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
	exports.showStorageLogger = exports.removeItem = exports.clear = exports.getItem = exports.setItem = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _session = __webpack_require__(2);

	var _session2 = _interopRequireDefault(_session);

	var _cookie = __webpack_require__(3);

	var _cookie2 = _interopRequireDefault(_cookie);

	var _utils = __webpack_require__(5);

	var _config = __webpack_require__(6);

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
	      (0, _utils.log)('Quota exceeded for "' + key + '"!', 'error', _config.debug);

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
	      (0, _utils.log)('Oops! Some problems parsing this ' + (typeof result === 'undefined' ? 'undefined' : _typeof(result)) + '.', 'error', _config.debug);
	    } else {
	      (0, _utils.log)(e, 'error', _config.debug);
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

	var showStorageLogger = exports.showStorageLogger = function showStorageLogger(value) {
	  (0, _config.setDebug)(!!value);
	};

	exports.default = { setItem: setItem, getItem: getItem, removeItem: removeItem, clear: clear };

/***/ },
/* 2 */
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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _session = __webpack_require__(2);

	var _session2 = _interopRequireDefault(_session);

	var _jsCookie = __webpack_require__(4);

	var _jsCookie2 = _interopRequireDefault(_jsCookie);

	var _utils = __webpack_require__(5);

	var _config = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var setItem = function setItem(key, value) {
	  var expires = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

	  if (window.navigator && !window.navigator.cookieEnabled) {
	    _session2.default.set(key, value);
	    (0, _utils.log)('I\'ve saved "' + key + '" in a plain object :)', 'warning', _config.debug);
	    return;
	  }

	  _jsCookie2.default.set(key, value, { expires: expires });
	  (0, _utils.log)('I\'ve saved "' + key + '" in a cookie :)', 'warning', _config.debug);
	};

	var getItem = function getItem(key) {
	  return _jsCookie2.default.get(key);
	};

	var removeItem = function removeItem(key) {
	  _jsCookie2.default.remove(key);
	};

	var clear = function clear() {
	  var cookies = document.cookie.split(';');

	  if (!cookies.length) {
	    return;
	  }

	  for (var i = 0, l = cookies.length; i < l; i++) {
	    var item = cookies[i];
	    var key = item.split('=')[0];

	    _jsCookie2.default.remove(key);
	  }
	};

	exports.default = { setItem: setItem, getItem: getItem, removeItem: removeItem, clear: clear };

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * JavaScript Cookie v2.1.3
	 * https://github.com/js-cookie/js-cookie
	 *
	 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
	 * Released under the MIT license
	 */
	;(function (factory) {
		var registeredInModuleLoader = false;
		if (true) {
			!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
			registeredInModuleLoader = true;
		}
		if (true) {
			module.exports = factory();
			registeredInModuleLoader = true;
		}
		if (!registeredInModuleLoader) {
			var OldCookies = window.Cookies;
			var api = window.Cookies = factory();
			api.noConflict = function () {
				window.Cookies = OldCookies;
				return api;
			};
		}
	}(function () {
		function extend () {
			var i = 0;
			var result = {};
			for (; i < arguments.length; i++) {
				var attributes = arguments[ i ];
				for (var key in attributes) {
					result[key] = attributes[key];
				}
			}
			return result;
		}

		function init (converter) {
			function api (key, value, attributes) {
				var result;
				if (typeof document === 'undefined') {
					return;
				}

				// Write

				if (arguments.length > 1) {
					attributes = extend({
						path: '/'
					}, api.defaults, attributes);

					if (typeof attributes.expires === 'number') {
						var expires = new Date();
						expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
						attributes.expires = expires;
					}

					try {
						result = JSON.stringify(value);
						if (/^[\{\[]/.test(result)) {
							value = result;
						}
					} catch (e) {}

					if (!converter.write) {
						value = encodeURIComponent(String(value))
							.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
					} else {
						value = converter.write(value, key);
					}

					key = encodeURIComponent(String(key));
					key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
					key = key.replace(/[\(\)]/g, escape);

					return (document.cookie = [
						key, '=', value,
						attributes.expires ? '; expires=' + attributes.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
						attributes.path ? '; path=' + attributes.path : '',
						attributes.domain ? '; domain=' + attributes.domain : '',
						attributes.secure ? '; secure' : ''
					].join(''));
				}

				// Read

				if (!key) {
					result = {};
				}

				// To prevent the for loop in the first place assign an empty array
				// in case there are no cookies at all. Also prevents odd result when
				// calling "get()"
				var cookies = document.cookie ? document.cookie.split('; ') : [];
				var rdecode = /(%[0-9A-Z]{2})+/g;
				var i = 0;

				for (; i < cookies.length; i++) {
					var parts = cookies[i].split('=');
					var cookie = parts.slice(1).join('=');

					if (cookie.charAt(0) === '"') {
						cookie = cookie.slice(1, -1);
					}

					try {
						var name = parts[0].replace(rdecode, decodeURIComponent);
						cookie = converter.read ?
							converter.read(cookie, name) : converter(cookie, name) ||
							cookie.replace(rdecode, decodeURIComponent);

						if (this.json) {
							try {
								cookie = JSON.parse(cookie);
							} catch (e) {}
						}

						if (key === name) {
							result = cookie;
							break;
						}

						if (!key) {
							result[name] = cookie;
						}
					} catch (e) {}
				}

				return result;
			}

			api.set = api;
			api.get = function (key) {
				return api.call(api, key);
			};
			api.getJSON = function () {
				return api.apply({
					json: true
				}, [].slice.call(arguments));
			};
			api.defaults = {};

			api.remove = function (key, attributes) {
				api(key, '', extend(attributes, {
					expires: -1
				}));
			};

			api.withConverter = init;

			return api;
		}

		return init(function () {});
	}));


/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var log = exports.log = function log(text) {
	  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'success';
	  var debug = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	  if (!debug) {
	    return;
	  }

	  var success = 'padding: 2px; background: #219621; color: #ffffff';
	  var warning = 'padding: 2px; background: #f1e05a; color: #333333';
	  var error = 'padding: 2px; background: #b9090b; color: #ffffff';
	  var types = { error: error, success: success, warning: warning };

	  console.log('%c [Storage Helper] ' + text + ' ', types[type]);
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var debug = exports.debug = false;

	var setDebug = exports.setDebug = function setDebug(value) {
	  exports.debug = debug = value;
	};

/***/ }
/******/ ])
});
;