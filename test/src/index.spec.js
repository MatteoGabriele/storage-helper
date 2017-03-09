import { expect } from 'chai'
import { setItem, getItem, removeItem, clear } from '../../src/index'

describe('Storage helper methods', () => {
  it ('should be able to save an item and retrieve the value', () => {
    setItem('foo', 1)

    expect(getItem('foo')).to.not.be.null
  })

  it ('should be able to parse a retrieved item value', () => {
    setItem('foo', 1)

    expect(getItem('foo', true)).to.equal(1)
  })

  it ('should be able to remove a single item', () => {
    setItem('foo', 1)
    setItem('bar', 2)
    removeItem('foo')

    expect(getItem('foo')).to.be.null
    expect(getItem('bar')).to.not.be.null
  })

  it ('should be able to remove all items', () => {
    setItem('foo', 1)
    setItem('bar', 2)
    clear()

    expect(getItem('foo')).to.be.null
    expect(getItem('bar')).to.be.null
  })

  it ('should fallback to a default value if the item is null or undefined', () => {
    expect(getItem('foo', false, 'bar')).to.equal('bar')
    expect(getItem('foo', true, 'bar')).to.equal('bar')
  })
})
