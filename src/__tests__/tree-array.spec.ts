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
import { PARENT_CONSTRAINT } from '../common'
import { Node } from '../tree-array'

class TNode extends Node {
  public [PARENT_CONSTRAINT] (newParent: Node): void {
    if (newParent instanceof TNode) {
      return
    }
    throw new Error('TNode can only be added to TNode.')
  }
}

describe('TreeArrayStatic', () => {
  test('parent', () => {
    const n1 = new TNode()
    const n2 = new TNode()
    n1.append(n2)
    expect(n1.index).toBe(undefined)
    expect(n2.index).toBe(0)
    expect(n1.parent).toBe(undefined)
    expect(n2.parent).toBe(n1)
    const n3 = new Node()
    expect(() => n3.append(n1)).toThrow('TNode')
  })
})
