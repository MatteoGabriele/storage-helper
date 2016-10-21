# Storage Helper
A very simple way to manager localStorage.
If doesn't exitst, the locastorage won throw an error, because will just saved inside an object.

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
