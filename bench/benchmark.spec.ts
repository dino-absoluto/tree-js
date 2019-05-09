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
import * as TreeLink from '../src/tree-link'
import * as TreeLinkStatic from '../src/tree-link-static'
import * as TreeArray from '../src/tree-array'
import round = require('lodash/round')

class TreeArrayNode extends TreeArray.Node {
  public id: number
  public constructor (id: number) {
    super()
    this.id = id
  }
}

class TreeLinkNode extends TreeLink.Node {
  public id: number
  public constructor (id: number) {
    super()
    this.id = id
  }
}

class TreeLinkNodeStatic extends TreeLinkStatic.Node {
  public id: number
  public constructor (id: number) {
    super()
    this.id = id
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
  minSamples: 1,
  delay: 0.1
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
  const tests: [string, () => void][] = [
    ['Array', makeTest(
      (id: number) => new CustomArray<unknown>(id)
    )],
    ['TreeArray', makeTest(
      (id: number) => new TreeArrayNode(id)
    )],
    ['TreeLink', makeTest(
      (id: number) => new TreeLinkNode(id)
    )],
    ['TreeLinkStatic', makeTest(
      (id: number) => new TreeLinkNodeStatic(id)
    )]
  ]
  for (const [ name, test ] of tests) {
    suite.add(name, test)
  }
  suite
    .on('cycle', (event: Benchmark.Event) => {
      const target = event.target as
        Benchmark & Benchmark.Suite & typeof Benchmark.options
      message.push(formatBench(target))
    })
    .on('complete', () => {
      message.push('Fastest is ' +
        c.magenta(suite.filter('fastest')
          .map((i: { name: string }) => i.name).join(', ')))
      console.log(message.join('\n'))
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
  const tests: [string, () => void][] = [
    ['Array', makeTest(
      (id: number) => new CustomArray<unknown>(id)
    )],
    ['TreeArray', makeTest(
      (id: number) => new TreeArrayNode(id)
    )],
    ['TreeLink', makeTest(
      (id: number) => new TreeLinkNode(id)
    )],
    ['TreeLinkStatic', makeTest(
      (id: number) => new TreeLinkNodeStatic(id)
    )]
  ]
  for (const [ name, test ] of tests) {
    suite.add(name, test)
  }
  suite
    .on('cycle', (event: Benchmark.Event) => {
      const target = event.target as
        Benchmark & Benchmark.Suite & typeof Benchmark.options
      message.push(formatBench(target))
    })
    .on('complete', () => {
      message.push('Fastest is ' +
        c.magenta(suite.filter('fastest')
          .map((i: { name: string }) => i.name).join(', ')))
      console.log(message.join('\n'))
    })
    .run()
})

test('synthetic', () => {
  const suite = new Benchmark.Suite('node')
  let message: string[] = []
  const makeTest =
  (create: (data: number) => TreeLinkNode): () => void => {
    return () => {
      const data = create(0)
      const n1 = create(1)
      const n2 = create(2)
      const n3 = create(3)
      const n4 = create(4)
      const n5 = create(5)
      data.append(n1)
      data.append(n2)
      data.append(n3, n4, n5)
      data.prepend(n1)
      data.prepend(n2)
      n1.remove()
      n2.remove()
      n3.remove()
      n4.remove()
      n5.remove()
      data.append(n1)
      // #1
      n1.before(n2)
      n2.after(n3)
      n3.replaceWith(n4)
      n4.before(n5)
      n5.after(n3)
      // #2
      n1.after(n2)
      n2.before(n3)
      n3.replaceWith(n4)
      n4.after(n5)
      n5.before(n3)
    }
  }
  const tests: [string, () => void][] = [
    ['TreeArray', makeTest(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (id: number) => new TreeArrayNode(id) as any
    )],
    ['TreeLink', makeTest(
      (id: number) => new TreeLinkNode(id)
    )],
    ['TreeLinkStatic', makeTest(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (id: number) => new TreeLinkNodeStatic(id) as any
    )]
  ]
  for (const [ name, test ] of tests) {
    suite.add(name, test)
  }
  suite
    .on('cycle', (event: Benchmark.Event) => {
      const target = event.target as
        Benchmark & Benchmark.Suite & typeof Benchmark.options
      message.push(formatBench(target))
    })
    .on('complete', () => {
      message.push('Fastest is ' +
        c.magenta(suite.filter('fastest')
          .map((i: { name: string }) => i.name).join(', ')))
      console.log(message.join('\n'))
    })
    .run()
})
