'use strict'

const tempdir = require('ipfs-utils/src/temp-dir')
const _TextEncoder = require('ipfs-utils/src/text-encoder')
const _TextDecoder = require('ipfs-utils/src/text-decoder')

/**
 * @template T
 * @typedef {import("./types").PromiseOrValue<T>} PromiseOrValue
 */

/**
 * @template T
 * @typedef {import("./types").AnyIterable<T>} AnyIterable
 */

/** @type {TextEncoder} */
const utf8Encoder = new _TextEncoder('utf8')
/** @type {TextDecoder} */
const utf8Decoder = new _TextDecoder('utf8')

/**
 * Filter
 *
 * @template T
 * @param {AnyIterable<T>} iterable
 * @param {(item: T) => PromiseOrValue<boolean>} filterer
 * @returns {AsyncGenerator<T>}
 */
const filter = (iterable, filterer) => {
  return (async function * () {
    for await (const value of iterable) {
      const keep = await filterer(value)
      if (!keep) continue
      yield value
    }
  })()
}

// Not just sort, because the sorter is given all the values and should return
// them all sorted
/**
 * Sort All
 *
 * @template T
 * @param {AnyIterable<T>} iterable
 * @param {(items: T[]) => PromiseOrValue<T[]>} sorter
 * @returns {AsyncGenerator<T>}
 */
const sortAll = (iterable, sorter) => {
  return (async function * () {
    let values = []
    for await (const value of iterable) values.push(value)
    values = await sorter(values)
    for (const value of values) yield value
  })()
}

/**
 *
 * @template T
 * @param {AsyncIterable<T> | Iterable<T>} iterable
 * @param {number} n
 * @returns {AsyncGenerator<T>}
 */
const take = (iterable, n) => {
  return (async function * () {
    if (n <= 0) return
    let i = 0
    for await (const value of iterable) {
      yield value
      i++
      if (i >= n) return
    }
  })()
}

/**
 *
 * @template T,O
 * @param {AsyncIterable<T> | Iterable<T>} iterable
 * @param {(item: T) => O} mapper
 * @returns {AsyncGenerator<O>}
 */
const map = (iterable, mapper) => {
  return (async function * () {
    for await (const value of iterable) {
      yield mapper(value)
    }
  })()
}

/**
 * @param {string} s
 * @param {string} r
 */
const replaceStartWith = (s, r) => {
  const matcher = new RegExp('^' + r)
  return s.replace(matcher, '')
}

module.exports = {
  map,
  take,
  sortAll,
  filter,
  utf8Encoder,
  utf8Decoder,
  tmpdir: tempdir,
  replaceStartWith
}
