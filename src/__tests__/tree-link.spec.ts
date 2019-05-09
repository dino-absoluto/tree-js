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
import { Node, PARENT_CONSTRAINT } from '../tree-link-static'

class TNode extends Node {
  public id: string
  public constructor (text: string) {
    super()
    this.id = text
  }
  public toJSON (): string {
    return this.id
  }
  public [PARENT_CONSTRAINT] (newParent: Node): void {
    if (newParent instanceof TNode) {
      return
    }
    throw new Error('TNode can only be added to TNode.')
  }
}

describe('TreeArrayStatic', () => {
  test('parent', () => {
    const n1 = new TNode('1')
    const n2 = new TNode('2')
    n1.append(n2)
    const n3 = new Node()
    expect(() => n3.append(n1)).toThrow('TNode')
  })
  test('loop', () => {
    const p = new TNode('parent')
    const n1 = new TNode('1')
    const n2 = new TNode('2')
    const n3 = new TNode('3')
    const n4 = new TNode('4')
    p.append(n1, n2, n3, n4)
    expect([...p.children]).toMatchObject([
      n1, n2, n3, n4
    ])
    expect([...p.children.valuesRight()]).toMatchObject([
      n4, n3, n2, n1
    ])
    expect([...p.children.entries()]).toMatchObject([
      [0, n1],
      [1, n2],
      [2, n3],
      [3, n4]
    ])
    expect([...p.children.entriesRight()]).toMatchObject([
      [3, n4],
      [2, n3],
      [1, n2],
      [0, n1]
    ])
  })
})
