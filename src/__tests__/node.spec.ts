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
import { Node } from '../node'

class TNode extends Node {
  public id: string
  public constructor (text: string) {
    super()
    this.id = text
  }
}

describe('Node', () => {
  test('simple', () => {
    const p = new TNode('parent')
    const n1 = new TNode('1')
    const n2 = new TNode('2')
    const n3 = new TNode('3')
    p.append(n1)
    p.append(n2)
    p.append(n3)
    expect([...p.children]).toMatchObject([
      n1, n2, n3
    ])
    p.prepend(n3)
    expect([...p.children]).toMatchObject([
      n3, n1, n2
    ])
    p.prepend(n1)
    expect([...p.children]).toMatchObject([
      n1, n3, n2
    ])
    n1.remove()
    n2.remove()
    n3.remove()
    expect([...p.children]).toMatchObject([])
    p.prepend(n1)
    p.prepend(n2)
    p.prepend(n3)
    expect([...p.children]).toMatchObject([
      n3, n2, n1
    ])
    n2.replaceWith(n1)
    expect([...p.children]).toMatchObject([
      n3, n1
    ])
    n2.after(n1)
    n2.before(n1)
    n2.replaceWith(n1)
    n2.remove()
    expect([...p.children]).toMatchObject([
      n3, n1
    ])
    n1.replaceWith()
    expect([...p.children]).toMatchObject([
      n3
    ])
    n3.after(n1)
    n3.after(n2)
    expect([...p.children]).toMatchObject([
      n3, n2, n1
    ])
    n2.before(n1)
    expect([...p.children]).toMatchObject([
      n3, n1, n2
    ])
    n3.replaceWith(n2)
    expect([...p.children]).toMatchObject([
      n2, n1
    ])
  })
  test('simple 2', () => {
    const p = new TNode('parent')
    const n1 = new TNode('1')
    const n2 = new TNode('2')
    const n3 = new TNode('3')
    const n4 = new TNode('4')
    p.append(n1, n2)
    p.append(n3)
    p.append(n4)
    n2.after(n1, n4, n3)
    expect([...p.children]).toMatchObject([
      n2, n1, n4, n3
    ])
    expect(p.firstChild).toBe(n2)
    expect(p.lastChild).toBe(n3)
  })
  test('sub tree', () => {
    const n1 = new TNode('1')
    const n2 = new TNode('2')
    const n3 = new TNode('3')
    const n4 = new TNode('4')
    n1.append(n2)
    n2.append(n3)
    n2.append(n4)
    expect([...n1.children]).toMatchObject([
      n2
    ])
    expect([...n2.children]).toMatchObject([
      n3, n4
    ])
  })
  test('serialization', () => {
    const n = new TNode('1')
    expect(JSON.stringify(n)).toBe('{"id":"1"}')
  })
})
