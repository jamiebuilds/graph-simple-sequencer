// @flow
'use strict';
const test = require('ava');
const graphSequencer = require('./');

test('graph with no dependencies', t => {
  t.deepEqual(
    graphSequencer(new Map([
      ['a', []],
      ['b', []],
      ['c', []],
      ['d', []],
    ])),
    {
      safe: true,
      chunks: [['a', 'b', 'c', 'd']],
    },
  );
});

test('graph with multiple dependencies on one item', t => {
  t.deepEqual(
    graphSequencer(new Map([
      ['a', ['d']],
      ['b', ['d']],
      ['c', []],
      ['d', []],
    ])),
    {
      safe: true,
      chunks: [['c', 'd'], ['a', 'b']],
    },
  );
});

test('graph with cycle', t => {
  t.deepEqual(
    graphSequencer(new Map([
      ['a', ['b']],
      ['b', ['c']],
      ['c', ['d']],
      ['d', ['a']],
    ])),
    {
      safe: false,
      chunks: [['a'], ['d'], ['c'], ['b']],
    },
  );
});

test('graph with cycle with multiple unblocked deps', t => {
  t.deepEqual(
    graphSequencer(new Map([
      ['a', ['d']],
      ['b', ['d']],
      ['c', ['d']],
      ['d', ['a']],
    ])),
    {
      safe: false,
      chunks: [['d'], ['a', 'b', 'c']],
    },
  );
});

test('graph with multiple cycles', t => {
  t.deepEqual(
    graphSequencer(new Map([
      ['a', ['b']],
      ['b', ['a']],
      ['c', ['d']],
      ['d', ['c']],
    ])),
    {
      safe: false,
      chunks: [['a'], ['b'], ['c'], ['d']],
    },
  );
});
