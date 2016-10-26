# Storage Helper
A very simple way to manage localStorage. Nothing fancy!
If it's not supported in the browser or the user is in a private window, won't throw an error, because data will just be saved inside an object.

## Installation
```js
npm install storage-helper
```
## Usage

``` js
import { setItem, getItem, removeItem } from 'storage-helper'

const storageKey = 'foo'
const value = 'bar'

// set data
setItem(storageKey, value)

// set data not permanently 
setItem(storageKey, value, false)

// get data
const foo = getItem(storageKey)

// get data parsed
const foo = getItem(storageKey, true)

// remove data
removeItem(storageKey)
```
