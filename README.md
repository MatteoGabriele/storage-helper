[![Build Status](https://travis-ci.org/MatteoGabriele/storage-helper.svg?branch=master)](https://travis-ci.org/MatteoGabriele/storage-helper) [![npm version](https://badge.fury.io/js/storage-helper.svg)](https://badge.fury.io/js/storage-helper) [![npm](https://img.shields.io/npm/dt/storage-helper.svg)](https://www.npmjs.com/package/storage-helper)

# storage-helper
A very simple way to manage browser storage.

If the browser doesn't support localStorage, data will be saved in a cookie.
If the browser then doesn't support cookies either (not a lucky day!), it will be saved in a plain object!
It also handles the QuotaExceeded error, silently logging it in the console and saving the data in the object.

## Installation
```js
npm install storage-helper
```
## Usage

``` js
import storageHelper from 'storage-helper'

const storageKey = 'foo'
const value = 'bar'

// set item
storageHelper.setItem(storageKey, value)

// set an item not permanently  
storageHelper.setItem(storageKey, value, false)

// get item
const foo = storageHelper.getItem(storageKey)

// get item parsed
const foo = storageHelper.getItem(storageKey, true)

// get item with fallback value in case the item is undefined or null
const foo = storageHelper.getItem(storageKey, false, 'foo')

// remove item
storageHelper.removeItem(storageKey)

// remove all items
storageHelper.clear()
```

It's also possible to export single functions from the module
```js
import { clear } from 'storage-helper'

clear()
```

The logger is by default set to false, so if you want to see logs during development,
you can just do like so
```js
import { showStorageLogger } from 'storage-helper'

showStorageLogger(true)
```
