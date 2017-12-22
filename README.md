# graph-simple-sequencer

> Sort items in a graph using a topological sort into chunks

## Install

```sh
yarn add graph-simple-sequencer
```

## Usage

```js
import graphSimpleSequencer from 'graph-simple-sequencer';

let graph = new Map([
  ["task-a", ["task-d"]], // task-a depends on task-d
  ["task-b", ["task-d", "task-a"]],
  ["task-c", ["task-d"]],
  ["task-d", ["task-a"]],
]);

let { safe, chunks } = graphSimpleSequencer(graph);
// { safe: false,
//   chunks: [['task-d'], ['task-a', 'task-b', 'task-c']] }

for (let chunk of chunks) {
  // Running tasks in parallel
  await Promise.all(chunk.map(task => exec(task)));
}
```

## Cycles

Graph cycles are resolved by creating a new chunk with the item that has:

1. The fewest number of remaining dependencies (to reduce risk of missing dependencies)
2. The highest number of remaining dependents (to increase chance of unblocking dependents)
