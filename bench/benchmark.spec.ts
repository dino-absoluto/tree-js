/**
 * @author Dino <dinoabsoluto+dev@gmail.com>
 * @license
 * Copyright 2019 Dino <dinoabsoluto+dev@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
/* imports */
import * as Benchmark from 'benchmark'
import * as c from 'kleur'
import { TreeLink, TreeArray, TreeArray2 } from '../src'
import round = require('lodash/round')

class TArrayNode extends TreeArray.Node {
  public id: number
  public constructor (id: number) {
    super()
    this.id = id
  }
  public [Symbol.iterator] (): IterableIterator<this> {
    return this.children[Symbol.iterator]() as IterableIterator<this>
  }
}

class TArrayNode2 extends TreeArray2.Node {
  public id: number
  public constructor (id: number) {
    super()
    this.id = id
  }
  public [Symbol.iterator] (): IterableIterator<this> {
    return this.children.values() as IterableIterator<this>
  }
}

class TLinkNode extends TreeLink.Node {
  public id: number
  public constructor (id: number) {
    super()
    this.id = id
  }
  public [Symbol.iterator] (): IterableIterator<this> {
    return this.children[Symbol.iterator]() as IterableIterator<this>
  }
}

type BenchResult = Benchmark & typeof Benchmark.options

const formatBench = (target: BenchResult): string => {
  return `${
    c.magenta(target.name || 'unnamed')
  } × ${
    c.yellow(Benchmark.formatNumber(Math.round(target.hz)))
  } ${c.green('ops/sec')} ${
    c.yellow('±' + round(target.stats.rme, 2) + '%')
  } (${
    c.yellow(target.stats.sample.length)
  } ${c.green('runs sampled')})`
}

// eslint-disable-next-line
//*
Object.assign(Benchmark.options, {
  maxTime: 1,
  minSamples: 1
})
// eslint-disable-next-line
/*/
// Do nothing
// */

interface Target<T> {
  append (...values: T[]): void
  prepend (...values: T[]): void
  children: {
    [Symbol.iterator] (): IterableIterator<T>
  }
}

class CustomArray<T> implements Target<T> {
  public children: T[] = []
  public id: number

  public constructor (id: number) {
    this.id = id
  }

  public append (...values: T[]): void {
    this.children.push(...values)
  }

  public prepend (...values: T[]): void {
    this.children.unshift(...values)
  }
}

test('append / prepend', () => {
  const suite = new Benchmark.Suite('node')
  let message: string[] = []
  const makeTest =
  (create: (data: number) => Target<unknown>): () => void => {
    return () => {
      const a = create(0)
      a.append(
        create(Math.random()),
        create(Math.random()),
        create(Math.random()),
        create(Math.random()),
        create(Math.random()),
        create(Math.random())
      )
      a.append(create(Math.random()))
      a.append(create(Math.random()))
      a.append(create(Math.random()))
      a.append(create(Math.random()))
      a.append(create(Math.random()))
      a.append(create(Math.random()))
      a.append(create(Math.random()))
      a.append(create(Math.random()))
      a.prepend(
        create(Math.random()),
        create(Math.random()),
        create(Math.random())
      )
      a.prepend(create(Math.random()))
      a.prepend(create(Math.random()))
      for (const i of a.children) {
        void (i)
      }
    }
  }
  suite
    .add('Array', makeTest(
      (id: number) =>
        new CustomArray<unknown>(id)
    ))
    .add('TLinkNode', makeTest(
      (id: number) =>
        new TLinkNode(id)
    ))
    .add('TArrayNode', makeTest(
      (id: number) =>
        new TArrayNode(id)
    ))
    .add('TArrayNode2', makeTest(
      (id: number) =>
        new TArrayNode2(id)
    ))
    .on('cycle', (event: Benchmark.Event) => {
      const target = event.target as
        Benchmark & Benchmark.Suite & typeof Benchmark.options
      message.push(formatBench(target))
    })
    .on('complete', function () {
      console.log(message.join('\n'))
      console.log('Fastest is ' +
        c.magenta(suite.filter('fastest')
          .map((i: { name: string }) => i.name) + ''))
    })
    .run({})
})

test('loop', () => {
  const suite = new Benchmark.Suite('node')
  let message: string[] = []
  const makeTest =
  (create: (data: number) => Target<unknown>): () => void => {
    const data = create(0)
    for (let i = 0; i < 1000; ++i) {
      data.append(create(Math.random()))
    }
    const children = data.children
    return () => {
      for (const i of children) {
        void ((i as { id: number }).id)
      }
    }
  }
  suite
    .add('Array', makeTest(
      (id: number) =>
        new CustomArray<unknown>(id)
    ))
    .add('TLinkNode', makeTest(
      (id: number) =>
        new TLinkNode(id)
    ))
    .add('TArrayNode', makeTest(
      (id: number) =>
        new TArrayNode(id)
    ))
    .add('TArrayNode2', makeTest(
      (id: number) =>
        new TArrayNode2(id)
    ))
    .on('cycle', (event: Benchmark.Event) => {
      const target = event.target as
        Benchmark & Benchmark.Suite & typeof Benchmark.options
      message.push(formatBench(target))
    })
    .on('complete', function () {
      console.log(message.join('\n'))
      console.log('Fastest is ' +
        c.magenta(suite.filter('fastest')
          .map((i: { name: string }) => i.name) + ''))
    })
    .run({})
})
