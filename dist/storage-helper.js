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
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
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
	    _session2.default.setItem(key, value);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA3ZjdkY2MxNmNmZTdkNjY5ZjE3MyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Nlc3Npb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Nvb2tpZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2pzLWNvb2tpZS9zcmMvanMuY29va2llLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uZmlnLmpzIl0sIm5hbWVzIjpbImlzQ29va2llRW5hYmxlZCIsIm5hdmlnYXRvciIsImNvb2tpZUVuYWJsZWQiLCJsb2NhbHN0b3JhZ2UiLCJ3aW5kb3ciLCJsb2NhbFN0b3JhZ2UiLCJ1bmRlZmluZWQiLCJjaGVja2VyIiwiaGFzTG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJlIiwia2V5IiwidmFsdWUiLCJwZXJzaXN0ZW5jeSIsImNvZGUiLCJnZXRJdGVtIiwicGFyc2VkIiwiY29va2llSXRlbSIsInNlc3Npb25JdGVtIiwicmVzdWx0IiwiSlNPTiIsInBhcnNlIiwiY2xlYXIiLCJzaG93U3RvcmFnZUxvZ2dlciIsInN0b3JhZ2UiLCJzdHJpbmdpZnkiLCJleHBpcmVzIiwic2V0IiwiZ2V0IiwicmVtb3ZlIiwiY29va2llcyIsImRvY3VtZW50IiwiY29va2llIiwic3BsaXQiLCJsZW5ndGgiLCJpIiwibCIsIml0ZW0iLCJsb2ciLCJ0ZXh0IiwidHlwZSIsImRlYnVnIiwic3VjY2VzcyIsIndhcm5pbmciLCJlcnJvciIsInR5cGVzIiwiY29uc29sZSIsInNldERlYnVnIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFD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QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsNEJBQTJCO0FBQzNCLEVBQUM7Ozs7Ozs7Ozs7OztBQ3RKTSxLQUFNZ0Isb0JBQU0sU0FBTkEsR0FBTSxDQUFDQyxJQUFELEVBQTJDO0FBQUEsT0FBcENDLElBQW9DLHVFQUE3QixTQUE2QjtBQUFBLE9BQWxCQyxLQUFrQix1RUFBVixLQUFVOztBQUM1RCxPQUFJLENBQUNBLEtBQUwsRUFBWTtBQUNWO0FBQ0Q7O0FBRUQsT0FBTUMsVUFBVSxtREFBaEI7QUFDQSxPQUFNQyxVQUFVLG1EQUFoQjtBQUNBLE9BQU1DLFFBQVEsbURBQWQ7QUFDQSxPQUFNQyxRQUFRLEVBQUVELFlBQUYsRUFBU0YsZ0JBQVQsRUFBa0JDLGdCQUFsQixFQUFkOztBQUVBRyxXQUFRUixHQUFSLDBCQUFtQ0MsSUFBbkMsUUFBNENNLE1BQU1MLElBQU4sQ0FBNUM7QUFDRCxFQVhNLEM7Ozs7Ozs7Ozs7O0FDTEEsS0FBSUMsd0JBQVEsS0FBWjs7QUFFQSxLQUFNTSw4QkFBVyxTQUFYQSxRQUFXLENBQUNuQyxLQUFELEVBQVc7QUFDakMsV0FIUzZCLEtBR1QsV0FBUTdCLEtBQVI7QUFDRCxFQUZNLEMiLCJmaWxlIjoic3RvcmFnZS1oZWxwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDdmN2RjYzE2Y2ZlN2Q2NjlmMTczIiwiaW1wb3J0IHNlc3Npb24gZnJvbSAnLi9zZXNzaW9uJ1xuaW1wb3J0IGNvb2tpZSBmcm9tICcuL2Nvb2tpZSdcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgeyBkZWJ1Zywgc2V0RGVidWcgfSBmcm9tICcuL2NvbmZpZydcblxuLyoqXG4gKiBDaGVja3MgaWYgY29va2llcyBhcmUgYmxvY2tlZC5cbiAqIFdpdGggY29va2llcyBhcmUgaW50ZW5kZWQgYWxsIHR5cGVzIG9mIGJyb3dzZXIgc3RvcmFnZTpcbiAqIGxvY2FsU3RvcmFnZSwgc2Vzc2lvblN0b3JhZ2UgYW5kIGNvb2tpZXNcbiAqIEluIGNhc2Ugb2YgYSBmYWxzZSB0aGUgcGxhaW4gb2JqZWN0IHN0b3Jpbmcgd2lsbCBraWNrIGluLlxuICogQHR5cGUge0Jvb2xlYW59XG4gKi9cbmNvbnN0IGlzQ29va2llRW5hYmxlZCA9IG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IuY29va2llRW5hYmxlZFxuXG4vKipcbiAqIFJlZmVyZW5jZSB0byB0aGUgbG9jYWxTdG9yYWdlIG9iamVjdFxuICogQXBwYXJlbnRseSBTYWZhcmkgZG9lc24ndCB3YW50IHRvIGV2ZW4gdHJ5IHRvIGNoZWNrIGlmIHRoZSBsb2NhbFN0b3JhZ2VcbiAqIGV4aXN0cywgc28gd2UncmUgbm90IGdvbm5hIHRvdWNoIGl0IGlmIGNvb2tpZXMgYXJlIGJsb2NrZWQgaW4gZmlyc3QgcGxhY2UuXG4gKiBAdHlwZSB7TG9jYWxTdG9yYWdlfVxuICovXG5jb25zdCBsb2NhbHN0b3JhZ2UgPSBpc0Nvb2tpZUVuYWJsZWQgPyB3aW5kb3cubG9jYWxTdG9yYWdlIDogdW5kZWZpbmVkXG5cbi8qKlxuICogVG8gYXZvaWQgdGhlIHRyeS9jYXRjaCB0byBiZSBjYWxsZWQgbXVsdGlwbGUgdGltZXMsIHRoZSB2YWx1ZVxuICogb2YgdGhlIGNoZWNrIGlzIGdvbm5hIGJlIHN0b3JlZCBoZXJlLlxuICogQHR5cGUge0Jvb2xlYW59XG4gKi9cbmxldCBjaGVja2VyXG5cbi8qKlxuICogTG9jYWxTdG9yYWdlIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5jb25zdCBoYXNMb2NhbFN0b3JhZ2UgPSAoKSA9PiB7XG4gIGlmICghbG9jYWxzdG9yYWdlKSB7XG4gICAgY2hlY2tlciA9IGZhbHNlXG4gIH1cblxuICBpZiAodHlwZW9mIGNoZWNrZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGNoZWNrZXJcbiAgfVxuXG4gIHRyeSB7XG4gICAgbG9jYWxzdG9yYWdlLnNldEl0ZW0oJzAnLCAnJylcbiAgICBsb2NhbHN0b3JhZ2UucmVtb3ZlSXRlbSgnMCcpXG4gICAgY2hlY2tlciA9IHRydWVcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNoZWNrZXIgPSBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIGNoZWNrZXJcbn1cblxuLyoqXG4gKiBTZXQgdGhlIGl0ZW0uXG4gKiBIZXJlIGRhdGEgd2lsbCBiZSBzYXZlZCBpbiB0aGUgTG9jYWxTdG9yYWdlIGlmIGl0IGRvZXNuJ3QgZXhpc3QsIG90aGVyd2lzZSB3ZSdsbFxuICogdHJ5IGNvb2tpZXMgYW5kIGlmIHdlJ3JlIG5vdCBpbiBhIGx1Y2t5IGRheSwgZGF0YSB3aWxsIGJlIHN0b3JlZCBpbiBhIHBsYWluIG9iamVjdC5cbiAqXG4gKiBBbiBleHRyYSBjaGVjayBpcyBkb25lIGhlcmUgZm9yIHRoZSBRdW90YUV4Y2VlZGVkRXJyb3IuXG4gKiBJJ2xsIHRyeSB0byBzYXZlIGRhdGEgYW5kIGp1c3Qgc2lsZW50bHkgd2FybmluZyBpdFxuICogaW4gdGhlIGNvbnNvbGUsIHNvIGFsc28gcmVhbC10aW1lIGVycm9yIHRyYWNraW5nIHRvb2xzIHdvbid0IHN0cmVzcyB0b28gbXVjaC5cbiAqIEBwYXJhbSB7U3RyaW5nfSAga2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gIHZhbHVlXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtwZXJzaXN0ZW5jeT10cnVlXVxuICovXG5leHBvcnQgY29uc3Qgc2V0SXRlbSA9IChrZXksIHZhbHVlLCBwZXJzaXN0ZW5jeSA9IHRydWUpID0+IHtcbiAgaWYgKCFoYXNMb2NhbFN0b3JhZ2UoKSB8fCAhcGVyc2lzdGVuY3kpIHtcbiAgICBpZiAoIXBlcnNpc3RlbmN5KSB7XG4gICAgICBzZXNzaW9uLnNldEl0ZW0oa2V5LCB2YWx1ZSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvb2tpZS5zZXRJdGVtKGtleSwgdmFsdWUpXG4gICAgcmV0dXJuXG4gIH1cblxuICB0cnkge1xuICAgIGxvY2Fsc3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zdCB7IGNvZGUgfSA9IGVcblxuICAgIGlmIChjb2RlID09PSAyMiB8fCBjb2RlID09PSAxMDE0KSB7XG4gICAgICBsb2coYFF1b3RhIGV4Y2VlZGVkIGZvciBcIiR7a2V5fVwiIWAsICdlcnJvcicsIGRlYnVnKVxuXG4gICAgICAvLyBMZXQncyB0cnkgd2l0aCBjb29raWVzIHRoZW4hXG4gICAgICBjb29raWUuc2V0SXRlbShrZXksIHZhbHVlKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEdldCB0aGUgaXRlbVxuICogSGVyZSB0aGUgb2JqZWN0IGlzIHRha2VuIGZyb20gdGhlIGxvY2FsU3RvcmFnZSBpZiBpdCB3YXMgYXZhaWxhYmxlLFxuICogb3IgZnJvbSB0aGUgb2JqZWN0IGlmIHdhc24ndCBwb3NzaWJsZSBvciBpZiBzaW1wbGUgd2Fzbid0IHNhdmVkIHBlcm1hbmVudGx5XG4gKiBAcGFyYW0gIHtTdHJpbmd9ICBrZXlcbiAqIEBwYXJhbSAge0Jvb2xlYW59IFtwYXJzZWQ9ZmFsc2VdXG4gKiBAcmV0dXJuIHthbnl9XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRJdGVtID0gKGtleSwgcGFyc2VkID0gZmFsc2UpID0+IHtcbiAgY29uc3QgY29va2llSXRlbSA9IGNvb2tpZS5nZXRJdGVtKGtleSlcbiAgY29uc3Qgc2Vzc2lvbkl0ZW0gPSBzZXNzaW9uLmdldEl0ZW0oa2V5KVxuXG4gIGxldCByZXN1bHRcblxuICBpZiAoIWhhc0xvY2FsU3RvcmFnZSgpKSB7XG4gICAgcmVzdWx0ID0gY29va2llSXRlbSB8fCBzZXNzaW9uSXRlbVxuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9IGxvY2Fsc3RvcmFnZS5nZXRJdGVtKGtleSkgfHwgY29va2llSXRlbSB8fCBzZXNzaW9uSXRlbVxuICB9XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gcGFyc2VkID8gSlNPTi5wYXJzZShyZXN1bHQpIDogcmVzdWx0XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAocGFyc2VkKSB7XG4gICAgICBsb2coYE9vcHMhIFNvbWUgcHJvYmxlbXMgcGFyc2luZyB0aGlzICR7dHlwZW9mIHJlc3VsdH0uYCwgJ2Vycm9yJywgZGVidWcpXG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZyhlLCAnZXJyb3InLCBkZWJ1ZylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG4vKipcbiAqIENsZWFyIGFsbCBzdG9yYWdlXG4gKi9cbmV4cG9ydCBjb25zdCBjbGVhciA9ICgpID0+IHtcbiAgY29va2llLmNsZWFyKClcbiAgc2Vzc2lvbi5jbGVhcigpXG5cbiAgaWYgKCFoYXNMb2NhbFN0b3JhZ2UoKSkge1xuICAgIHJldHVyblxuICB9XG5cbiAgbG9jYWxzdG9yYWdlLmNsZWFyKClcbn1cblxuLyoqXG4gKiBSZW1vdmUgYSBzaW5nbGUgaXRlbSBmcm9tIHRoZSBzdG9yYWdlXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICBrZXlcbiAqL1xuZXhwb3J0IGNvbnN0IHJlbW92ZUl0ZW0gPSAoa2V5KSA9PiB7XG4gIGNvb2tpZS5yZW1vdmVJdGVtKGtleSlcbiAgc2Vzc2lvbi5yZW1vdmVJdGVtKGtleSlcblxuICBpZiAoIWhhc0xvY2FsU3RvcmFnZSgpKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBsb2NhbHN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpXG59XG5cbmV4cG9ydCBjb25zdCBzaG93U3RvcmFnZUxvZ2dlciA9ICh2YWx1ZSkgPT4ge1xuICBzZXREZWJ1ZyghIXZhbHVlKVxufVxuXG4vKipcbiAqIEV4cG9ydHMgYWxsIGZlYXR1cmVzLCBzbyB3aWxsIGJlIHBvc3NpYmxlIHRvIHVzZSBpdCBhcyBhbiBvYmplY3QgYXMgd2VsbFxuICovXG5leHBvcnQgZGVmYXVsdCB7IHNldEl0ZW0sIGdldEl0ZW0sIHJlbW92ZUl0ZW0sIGNsZWFyIH1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyIsIi8qKlxuICogVGhpcyB3aWxsIGJlIG91ciBzZXNzaW9uIHN0b3JhZ2UgaW4gY2FzZSBvZiBldmVyeXRoaW5nIGZhaWxzIVxuICogRmlyc3Qgd2lsbCB0cnkgdG8gdXNlIGxvY2FsU3RvcmFnZSwgdGhlbiBjb29raWVzIGFuZCBpZiB3ZSBjYW4ndCB3cml0ZVxuICogdGhhdCBlaXRoZXIsIHdlJ3JlIGdvbm5hIHN0b3JlIGl0IGhlcmUuXG4gKiBAdHlwZSB7QXJyYXl9XG4gKi9cbmxldCBzdG9yYWdlID0gW11cblxuLyoqXG4gKiBBZGQgaXRlbSBpbiBvdXQgc2Vzc2lvbiBzdG9yYWdlXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAqL1xuY29uc3Qgc2V0SXRlbSA9IChrZXksIHZhbHVlKSA9PiB7XG4gIHN0b3JhZ2Vba2V5XSA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyB2YWx1ZSA6IEpTT04uc3RyaW5naWZ5KHZhbHVlKVxufVxuXG4vKipcbiAqIFJldHVybiB0aGUgaXRlbSBmcm9tIG91dCBzZXNzaW9uIHN0b3JhZ2VcbiAqIEl0IHdpbGwgYWx3YXlzIHJldHVybnMgYSBzdHJpbmcgc28gZXZlcnkgZGF0YSB3aWxsIGJlXG4gKiB0cmVhdGVkIGxpa2UgaXQgY29tZXMgZnJvbSB0aGUgbG9jYWxTdG9yYWdlLlxuICogQHBhcmFtICB7U3RyaW5nfSBrZXlcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuY29uc3QgZ2V0SXRlbSA9IChrZXkpID0+IHtcbiAgcmV0dXJuIHN0b3JhZ2Vba2V5XSB8fCBudWxsXG59XG5cbmNvbnN0IGNsZWFyID0gKCkgPT4ge1xuICBzdG9yYWdlID0gW11cbn1cblxuLyoqXG4gKiBSZW1vdmUgaXRlbSBmcm9tIHRoZSBzZXNzaW9uIHN0b3JhZ2VcbiAqIEBwYXJhbSAge1N0cmluZ30gIGtleVxuICovXG5jb25zdCByZW1vdmVJdGVtID0gKGtleSkgPT4ge1xuICBpZiAoIXN0b3JhZ2Vba2V5XSkge1xuICAgIHJldHVyblxuICB9XG5cbiAgZGVsZXRlIHN0b3JhZ2Vba2V5XVxufVxuXG5leHBvcnQgZGVmYXVsdCB7IHNldEl0ZW0sIGdldEl0ZW0sIHJlbW92ZUl0ZW0sIGNsZWFyIH1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zZXNzaW9uLmpzIiwiaW1wb3J0IHNlc3Npb24gZnJvbSAnLi9zZXNzaW9uJ1xuaW1wb3J0IGNvb2tpZSBmcm9tICdqcy1jb29raWUnXG5pbXBvcnQgeyBsb2cgfSBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0IHsgZGVidWcgfSBmcm9tICcuL2NvbmZpZydcblxuLyoqXG4gKiBTZXQgdGhlIGl0ZW0gaW4gdGhlIGNvb2tpZXMgaWYgcG9zc2libGUsIG90aGVyd2lzZSBpcyBnb2luZyB0byBzdG9yZSBpdFxuICogaW5zaWRlIGEgcGxhaW4gb2JqZWN0XG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAqIEBwYXJhbSB7TnVtYmVyfSBbZXhwaXJlcz0xXVxuICovXG5jb25zdCBzZXRJdGVtID0gKGtleSwgdmFsdWUsIGV4cGlyZXMgPSAxKSA9PiB7XG4gIGlmICh3aW5kb3cubmF2aWdhdG9yICYmICF3aW5kb3cubmF2aWdhdG9yLmNvb2tpZUVuYWJsZWQpIHtcbiAgICBzZXNzaW9uLnNldEl0ZW0oa2V5LCB2YWx1ZSlcbiAgICBsb2coYEkndmUgc2F2ZWQgXCIke2tleX1cIiBpbiBhIHBsYWluIG9iamVjdCA6KWAsICd3YXJuaW5nJywgZGVidWcpXG4gICAgcmV0dXJuXG4gIH1cblxuICBjb29raWUuc2V0KGtleSwgdmFsdWUsIHsgZXhwaXJlcyB9KVxuICBsb2coYEkndmUgc2F2ZWQgXCIke2tleX1cIiBpbiBhIGNvb2tpZSA6KWAsICd3YXJuaW5nJywgZGVidWcpXG59XG5cbi8qKlxuICogR2V0IHZhbHVlIGZyb20gYSBjb29raWVcbiAqIEBwYXJhbSAge1N0cmluZ30ga2V5XG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmNvbnN0IGdldEl0ZW0gPSAoa2V5KSA9PiB7XG4gIHJldHVybiBjb29raWUuZ2V0KGtleSlcbn1cblxuLyoqXG4gKiBSZW1vdmUgY29va2llXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGtleSBbZGVzY3JpcHRpb25dXG4gKi9cbmNvbnN0IHJlbW92ZUl0ZW0gPSAoa2V5KSA9PiB7XG4gIGNvb2tpZS5yZW1vdmUoa2V5KVxufVxuXG4vKipcbiAqIFJlbW92ZSBhbGwgY29va2llc1xuICovXG5jb25zdCBjbGVhciA9ICgpID0+IHtcbiAgY29uc3QgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpXG5cbiAgaWYgKCFjb29raWVzLmxlbmd0aCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgZm9yIChsZXQgaSA9IDAsIGwgPSBjb29raWVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IGl0ZW0gPSBjb29raWVzW2ldXG4gICAgY29uc3Qga2V5ID0gaXRlbS5zcGxpdCgnPScpWzBdXG5cbiAgICBjb29raWUucmVtb3ZlKGtleSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB7IHNldEl0ZW0sIGdldEl0ZW0sIHJlbW92ZUl0ZW0sIGNsZWFyIH1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb29raWUuanMiLCIvKiFcbiAqIEphdmFTY3JpcHQgQ29va2llIHYyLjEuM1xuICogaHR0cHM6Ly9naXRodWIuY29tL2pzLWNvb2tpZS9qcy1jb29raWVcbiAqXG4gKiBDb3B5cmlnaHQgMjAwNiwgMjAxNSBLbGF1cyBIYXJ0bCAmIEZhZ25lciBCcmFja1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKi9cbjsoZnVuY3Rpb24gKGZhY3RvcnkpIHtcblx0dmFyIHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IGZhbHNlO1xuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0ZGVmaW5lKGZhY3RvcnkpO1xuXHRcdHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IHRydWU7XG5cdH1cblx0aWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRcdHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IHRydWU7XG5cdH1cblx0aWYgKCFyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIpIHtcblx0XHR2YXIgT2xkQ29va2llcyA9IHdpbmRvdy5Db29raWVzO1xuXHRcdHZhciBhcGkgPSB3aW5kb3cuQ29va2llcyA9IGZhY3RvcnkoKTtcblx0XHRhcGkubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHdpbmRvdy5Db29raWVzID0gT2xkQ29va2llcztcblx0XHRcdHJldHVybiBhcGk7XG5cdFx0fTtcblx0fVxufShmdW5jdGlvbiAoKSB7XG5cdGZ1bmN0aW9uIGV4dGVuZCAoKSB7XG5cdFx0dmFyIGkgPSAwO1xuXHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRmb3IgKDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSBhcmd1bWVudHNbIGkgXTtcblx0XHRcdGZvciAodmFyIGtleSBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdHJlc3VsdFtrZXldID0gYXR0cmlidXRlc1trZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCAoY29udmVydGVyKSB7XG5cdFx0ZnVuY3Rpb24gYXBpIChrZXksIHZhbHVlLCBhdHRyaWJ1dGVzKSB7XG5cdFx0XHR2YXIgcmVzdWx0O1xuXHRcdFx0aWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBXcml0ZVxuXG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0YXR0cmlidXRlcyA9IGV4dGVuZCh7XG5cdFx0XHRcdFx0cGF0aDogJy8nXG5cdFx0XHRcdH0sIGFwaS5kZWZhdWx0cywgYXR0cmlidXRlcyk7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBhdHRyaWJ1dGVzLmV4cGlyZXMgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdFx0dmFyIGV4cGlyZXMgPSBuZXcgRGF0ZSgpO1xuXHRcdFx0XHRcdGV4cGlyZXMuc2V0TWlsbGlzZWNvbmRzKGV4cGlyZXMuZ2V0TWlsbGlzZWNvbmRzKCkgKyBhdHRyaWJ1dGVzLmV4cGlyZXMgKiA4NjRlKzUpO1xuXHRcdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGV4cGlyZXM7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcblx0XHRcdFx0XHRpZiAoL15bXFx7XFxbXS8udGVzdChyZXN1bHQpKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHJlc3VsdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XG5cblx0XHRcdFx0aWYgKCFjb252ZXJ0ZXIud3JpdGUpIHtcblx0XHRcdFx0XHR2YWx1ZSA9IGVuY29kZVVSSUNvbXBvbmVudChTdHJpbmcodmFsdWUpKVxuXHRcdFx0XHRcdFx0LnJlcGxhY2UoLyUoMjN8MjR8MjZ8MkJ8M0F8M0N8M0V8M0R8MkZ8M0Z8NDB8NUJ8NUR8NUV8NjB8N0J8N0R8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBjb252ZXJ0ZXIud3JpdGUodmFsdWUsIGtleSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRrZXkgPSBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKGtleSkpO1xuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvJSgyM3wyNHwyNnwyQnw1RXw2MHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoL1tcXChcXCldL2csIGVzY2FwZSk7XG5cblx0XHRcdFx0cmV0dXJuIChkb2N1bWVudC5jb29raWUgPSBbXG5cdFx0XHRcdFx0a2V5LCAnPScsIHZhbHVlLFxuXHRcdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA/ICc7IGV4cGlyZXM9JyArIGF0dHJpYnV0ZXMuZXhwaXJlcy50b1VUQ1N0cmluZygpIDogJycsIC8vIHVzZSBleHBpcmVzIGF0dHJpYnV0ZSwgbWF4LWFnZSBpcyBub3Qgc3VwcG9ydGVkIGJ5IElFXG5cdFx0XHRcdFx0YXR0cmlidXRlcy5wYXRoID8gJzsgcGF0aD0nICsgYXR0cmlidXRlcy5wYXRoIDogJycsXG5cdFx0XHRcdFx0YXR0cmlidXRlcy5kb21haW4gPyAnOyBkb21haW49JyArIGF0dHJpYnV0ZXMuZG9tYWluIDogJycsXG5cdFx0XHRcdFx0YXR0cmlidXRlcy5zZWN1cmUgPyAnOyBzZWN1cmUnIDogJydcblx0XHRcdFx0XS5qb2luKCcnKSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlYWRcblxuXHRcdFx0aWYgKCFrZXkpIHtcblx0XHRcdFx0cmVzdWx0ID0ge307XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRvIHByZXZlbnQgdGhlIGZvciBsb29wIGluIHRoZSBmaXJzdCBwbGFjZSBhc3NpZ24gYW4gZW1wdHkgYXJyYXlcblx0XHRcdC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLiBBbHNvIHByZXZlbnRzIG9kZCByZXN1bHQgd2hlblxuXHRcdFx0Ly8gY2FsbGluZyBcImdldCgpXCJcblx0XHRcdHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llID8gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7ICcpIDogW107XG5cdFx0XHR2YXIgcmRlY29kZSA9IC8oJVswLTlBLVpdezJ9KSsvZztcblx0XHRcdHZhciBpID0gMDtcblxuXHRcdFx0Zm9yICg7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhciBwYXJ0cyA9IGNvb2tpZXNbaV0uc3BsaXQoJz0nKTtcblx0XHRcdFx0dmFyIGNvb2tpZSA9IHBhcnRzLnNsaWNlKDEpLmpvaW4oJz0nKTtcblxuXHRcdFx0XHRpZiAoY29va2llLmNoYXJBdCgwKSA9PT0gJ1wiJykge1xuXHRcdFx0XHRcdGNvb2tpZSA9IGNvb2tpZS5zbGljZSgxLCAtMSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHZhciBuYW1lID0gcGFydHNbMF0ucmVwbGFjZShyZGVjb2RlLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXHRcdFx0XHRcdGNvb2tpZSA9IGNvbnZlcnRlci5yZWFkID9cblx0XHRcdFx0XHRcdGNvbnZlcnRlci5yZWFkKGNvb2tpZSwgbmFtZSkgOiBjb252ZXJ0ZXIoY29va2llLCBuYW1lKSB8fFxuXHRcdFx0XHRcdFx0Y29va2llLnJlcGxhY2UocmRlY29kZSwgZGVjb2RlVVJJQ29tcG9uZW50KTtcblxuXHRcdFx0XHRcdGlmICh0aGlzLmpzb24pIHtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdGNvb2tpZSA9IEpTT04ucGFyc2UoY29va2llKTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGtleSA9PT0gbmFtZSkge1xuXHRcdFx0XHRcdFx0cmVzdWx0ID0gY29va2llO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCFrZXkpIHtcblx0XHRcdFx0XHRcdHJlc3VsdFtuYW1lXSA9IGNvb2tpZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXG5cdFx0YXBpLnNldCA9IGFwaTtcblx0XHRhcGkuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0cmV0dXJuIGFwaS5jYWxsKGFwaSwga2V5KTtcblx0XHR9O1xuXHRcdGFwaS5nZXRKU09OID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGFwaS5hcHBseSh7XG5cdFx0XHRcdGpzb246IHRydWVcblx0XHRcdH0sIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG5cdFx0fTtcblx0XHRhcGkuZGVmYXVsdHMgPSB7fTtcblxuXHRcdGFwaS5yZW1vdmUgPSBmdW5jdGlvbiAoa2V5LCBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRhcGkoa2V5LCAnJywgZXh0ZW5kKGF0dHJpYnV0ZXMsIHtcblx0XHRcdFx0ZXhwaXJlczogLTFcblx0XHRcdH0pKTtcblx0XHR9O1xuXG5cdFx0YXBpLndpdGhDb252ZXJ0ZXIgPSBpbml0O1xuXG5cdFx0cmV0dXJuIGFwaTtcblx0fVxuXG5cdHJldHVybiBpbml0KGZ1bmN0aW9uICgpIHt9KTtcbn0pKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9qcy1jb29raWUvc3JjL2pzLmNvb2tpZS5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIExvZ2dlciBmb3IgZGlmZmVyZW50IHR5cGUgb2YgbWVzc2FnZXMuXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHRleHRcbiAqIEBwYXJhbSAge1N0cmluZ30gW3R5cGU9J3N1Y2Nlc3MnXVxuICovXG5leHBvcnQgY29uc3QgbG9nID0gKHRleHQsIHR5cGUgPSAnc3VjY2VzcycsIGRlYnVnID0gZmFsc2UpID0+IHtcbiAgaWYgKCFkZWJ1Zykge1xuICAgIHJldHVyblxuICB9XG5cbiAgY29uc3Qgc3VjY2VzcyA9ICdwYWRkaW5nOiAycHg7IGJhY2tncm91bmQ6ICMyMTk2MjE7IGNvbG9yOiAjZmZmZmZmJ1xuICBjb25zdCB3YXJuaW5nID0gJ3BhZGRpbmc6IDJweDsgYmFja2dyb3VuZDogI2YxZTA1YTsgY29sb3I6ICMzMzMzMzMnXG4gIGNvbnN0IGVycm9yID0gJ3BhZGRpbmc6IDJweDsgYmFja2dyb3VuZDogI2I5MDkwYjsgY29sb3I6ICNmZmZmZmYnXG4gIGNvbnN0IHR5cGVzID0geyBlcnJvciwgc3VjY2Vzcywgd2FybmluZyB9XG5cbiAgY29uc29sZS5sb2coYCVjIFtTdG9yYWdlIEhlbHBlcl0gJHt0ZXh0fSBgLCB0eXBlc1t0eXBlXSlcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy91dGlscy5qcyIsImV4cG9ydCBsZXQgZGVidWcgPSBmYWxzZVxuXG5leHBvcnQgY29uc3Qgc2V0RGVidWcgPSAodmFsdWUpID0+IHtcbiAgZGVidWcgPSB2YWx1ZVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbmZpZy5qcyJdLCJzb3VyY2VSb290IjoiIn0=