// @flow
'use strict';

/*::
type Graph<T> = Map<T, Array<T>>;
type Chunks<T> = Array<Array<T>>;
type Result<T> = { safe: boolean, chunks: Chunks<T> };
*/

function graphSimpleSequencer/*::<T>*/(graph /*: Graph<T> */) /*: Result<T> */ {
  let chunks = [];
  let safe = true;
  let queue = new Set(graph.keys());

  while (queue.size) {
    let chunk = [];
    let current = new Map();

    for (let key of queue) {
      let deps = graph.get(key) || [];
      let curr = deps.filter(dep => queue.has(dep));

      current.set(key, curr);

      if (!curr.length) {
        chunk.push(key);
        queue.delete(key);
      }
    }

    if (chunk.length === 0) {
      let items = Array.from(queue);

      let sorted = items.sort((a, b) => {
        let aCurr = current.get(a) || [];
        let bCurr = current.get(b) || [];
        let deps = aCurr.length - bCurr.length;
        if (deps !== 0) return deps;

        let aChildren = items.filter(item => (current.get(item) || []).includes(a));
        let bChildren = items.filter(item => (current.get(item) || []).includes(b));
        return bChildren.length - aChildren.length;
      });

      let first = sorted[0];

      chunk.push(first);
      queue.delete(first);
      safe = false;
    }

    chunks.push(chunk);
  }

  return { safe, chunks };
}

module.exports = graphSimpleSequencer;
