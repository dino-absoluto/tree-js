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
import { TreeLink, TreeArray } from '../src'
import round = require('lodash/round')

class TArrayNode extends TreeArray.Node {
  public id: number
  public constructor (id: number) {
    super()
    this.id = id
  }
}

class TLinkNode extends TreeLink.Node {
  public id: number
  public constructor (id: number) {
    super()
    this.id = id
  }
}

Object.assign(Benchmark.options, {
  maxTime: 1,
  minSamples: 1
})

test('benchmark', () => {
  const suite = new Benchmark.Suite('node')
  const staticArray: number[][] = []
  const staticTLinkNode = new TLinkNode(0)
  const staticTArrayNode = new TArrayNode(0)
  for (let i = 0; i < 100; ++i) {
    const n = Math.random()
    staticArray.push([ n ])
    staticTLinkNode.append(new TLinkNode(n))
    staticTArrayNode.append(new TArrayNode(n))
  }
  const staticTLinkNodeChildren = staticTLinkNode.children
  const staticTArrayNodeChildren = staticTArrayNode.children
  let message: string[] = []
  suite
    .add('Array', () => {
      const a = []
      a.push(
        [ Math.random() ],
        [ Math.random() ],
        [ Math.random() ]
      )
      for (const i of a) {
        void (i)
      }
    })
    .add('TLinkNode', () => {
      const a = new TLinkNode(0)
      a.append(
        new TLinkNode(Math.random()),
        new TLinkNode(Math.random()),
        new TLinkNode(Math.random())
      )
      for (const i of a.children) {
        void (i)
      }
    })
    .add('TArrayNode', () => {
      const a = new TArrayNode(0)
      a.append(
        new TArrayNode(Math.random()),
        new TArrayNode(Math.random()),
        new TArrayNode(Math.random())
      )
      for (const i of a.children) {
        void (i)
      }
    })
    .add('staticArray', () => {
      for (const i of staticArray) {
        void (i)
      }
    })
    .add('staticTLinkNode', () => {
      for (const i of staticTLinkNodeChildren) {
        void (i)
      }
    })
    .add('staticTArrayNode', () => {
      for (const i of staticTArrayNodeChildren) {
        void (i)
      }
    })
    .on('cycle', (event: Benchmark.Event) => {
      const target = event.target as
        Benchmark & Benchmark.Suite & typeof Benchmark.options
      message.push(`${
        c.magenta(target.name || 'unnamed')
      } × ${
        c.yellow(Benchmark.formatNumber(Math.round(target.hz)))
      } ${c.green('ops/sec')} ${
        c.yellow('±' + round(target.stats.rme, 2) + '%')
      } (${
        c.yellow(target.stats.sample.length)
      } ${c.green('runs sampled')})`)
    })
    .on('complete', function () {
      console.log(message.join('\n'))
      console.log('Fastest is ' +
        c.magenta(suite.filter('fastest')
          .map((i: { name: string }) => i.name) + ''))
    })
    .run({})
})
