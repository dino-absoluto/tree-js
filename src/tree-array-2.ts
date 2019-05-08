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
import { ChildNode, ParentNode } from './common'

/* code */
const PARENT = Symbol('parent')
const CHILDREN = Symbol('children')

interface ParentPointer {
  parent: Node
  index: number
}

/**
 * A child node.
 */
export class Node implements ChildNode, ParentNode {
  private [PARENT]?: ParentPointer
  private [CHILDREN]: Node[] = []

  private getPointer (): ParentPointer {
    const ptr = this[PARENT]
    if (ptr) {
      return ptr
    }
    throw new Error('This node has no parent.')
  }

  private setPointer (ptr?: ParentPointer): void {
    this[PARENT] = ptr
  }

  public get parent (): Node | undefined {
    const ptr = this[PARENT]
    if (ptr) {
      return ptr.parent
    }
  }

  public get firstChild (): Node | undefined {
    return this[CHILDREN][0]
  }

  public get lastChild (): Node | undefined {
    const { [CHILDREN]: children } = this
    return children[children.length - 1]
  }

  public get index (): number | undefined {
    const ptr = this[PARENT]
    if (ptr) {
      return ptr.index
    }
  }

  public get children (): readonly Node[] {
    return this[CHILDREN]
  }

  private updateIndex (
    start: number = 0,
    end: number = this[CHILDREN].length,
    children = this[CHILDREN]
  ): void {
    for (let i = start; i < end; ++i) {
      children[i].setPointer({
        parent: this,
        index: i
      })
    }
  }

  public remove (): void {
    const { parent, index } = this.getPointer()
    parent[CHILDREN].splice(index, 1)
    parent.updateIndex(index)
  }

  public before (...nodes: Node[]): void {
    const { parent, index } = this.getPointer()
    parent[CHILDREN].splice(index, 0, ...nodes)
    parent.updateIndex(index)
  }

  public after (...nodes: Node[]): void {
    const { parent, index } = this.getPointer()
    parent[CHILDREN].splice(index + 1, 0, ...nodes)
    parent.updateIndex(index + 1)
  }

  public replaceWith (...nodes: Node[]): void {
    const { parent, index } = this.getPointer()
    parent[CHILDREN].splice(index, 1, ...nodes)
    if (nodes.length === 1) {
      parent.updateIndex(index, index + 1)
    } else {
      parent.updateIndex(index)
    }
  }

  public append (...nodes: Node[]): void {
    const children = this[CHILDREN]
    const start = children.length
    this[CHILDREN] = children.concat(nodes)
    this.updateIndex(start)
  }

  public prepend (...nodes: Node[]): void {
    this[CHILDREN] = nodes.concat(this[CHILDREN])
    this.updateIndex()
  }
}
