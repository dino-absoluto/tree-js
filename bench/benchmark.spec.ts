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
import { Suite } from 'benchmark'
import { TreeLink, TreeArray } from '../src'

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

test('benchmark', () => {
  const suite = new Suite('node')
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
    .on('cycle', (event: Event) => {
      console.log(String(event.target))
    })
    .on('complete', function () {
      console.log('Fastest is ' +
        suite.filter('fastest')
          .map((i: { name: string }) => i.name))
    })
    .run({})
})
