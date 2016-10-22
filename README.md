# Storage Helper
A very simple way to manage localStorage. Nothing fency!
If it's not supported in the browser or the user is in a private window, won't throw an error, because data will just be saved inside an object.

``` js
import { setItem, getItem, removeItem } from 'storage-helper'

// set data
setItem('foo', 'bar')
// set data permanently or not
setItem('foo', 'bar', false)

// get data
const foo = getItem('foo')
// get data parsed
const foo = getItem('foo', true)

// remove data
removeItem('foo')
```
