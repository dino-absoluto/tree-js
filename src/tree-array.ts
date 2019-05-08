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

  private setPointer (ptr?: ParentPointer): void {
    this[PARENT] = ptr
  }

  public get parent (): Node | undefined {
    const ptr = this[PARENT]
    if (ptr) {
      return ptr.parent
    }
  }

  public get children (): readonly Node[] {
    return this[CHILDREN]
  }

  public get firstChild (): Node | undefined {
    return this[CHILDREN][0]
  }

  public get lastChild (): Node | undefined {
    const { children } = this
    return children[children.length - 1]
  }

  public get index (): number | undefined {
    const ptr = this[PARENT]
    if (ptr) {
      return ptr.index
    }
  }

  private static takeOver (nodes: Node[]): void {
    for (const node of nodes) {
      if (node.parent) {
        node.remove()
      }
    }
  }

  private updateIndex (
    start: number = 0,
    end: number = this[CHILDREN].length
  ): void {
    const { children } = this
    for (let i = start; i < end; ++i) {
      children[i].setPointer({
        parent: this,
        index: i
      })
    }
  }

  public remove (): void {
    const { parent } = this
    if (!parent) {
      return
    }
    const index = this.index as number
    this.setPointer()
    parent[CHILDREN].splice(index, 1)
    parent.updateIndex(index)
  }

  public before (...nodes: Node[]): void {
    const { parent } = this
    if (!parent) {
      return
    }
    const index = this.index as number
    Node.takeOver(nodes)
    parent[CHILDREN].splice(index, 0, ...nodes)
    parent.updateIndex(index)
  }

  public after (...nodes: Node[]): void {
    const { parent } = this
    if (!parent) {
      return
    }
    const index = this.index as number
    Node.takeOver(nodes)
    parent[CHILDREN].splice(index + 1, 0, ...nodes)
    parent.updateIndex(index + 1)
  }

  public replaceWith (...nodes: Node[]): void {
    const { parent } = this
    if (!parent) {
      return
    }
    const index = this.index as number
    Node.takeOver(nodes)
    parent[CHILDREN].splice(index, 1, ...nodes)
    this.setPointer()
    if (nodes.length === 1) {
      parent.updateIndex(index, index + 1)
    } else {
      parent.updateIndex(index)
    }
  }

  public append (...nodes: Node[]): void {
    const { children } = this
    const start = children.length
    Node.takeOver(nodes)
    this[CHILDREN] = children.concat(nodes)
    this.updateIndex(start)
  }

  public prepend (...nodes: Node[]): void {
    Node.takeOver(nodes)
    this[CHILDREN] = nodes.concat(this[CHILDREN])
    this.updateIndex()
  }
}
