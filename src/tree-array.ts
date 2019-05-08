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

interface ParentPointer {
  parent: Node
  index: number
}

export class NodeArray<T extends Node> extends Array<T> {
  private parent: Node
  public constructor (parent: Node) {
    super()
    this.parent = parent
  }

  private updateIndex (begin = 0, end = this.length): void {
    const { parent } = this
    for (let i = begin; i < end; ++i) {
      if (!this[i]) {
        continue
      }
      this[i].setParent({
        parent,
        index: i
      })
    }
  }

  public push (...nodes: T[]): number {
    const lastLength = this.length
    const length = super.push(...nodes)
    this.updateIndex(lastLength)
    return length
  }

  public pop (): T | undefined {
    const node = super.pop()
    if (node) {
      node.setParent(undefined)
    }
    return node
  }

  public shift (): T | undefined {
    const node = super.shift()
    if (node) {
      node.setParent(undefined)
    }
    this.updateIndex()
    return node
  }

  public unshift (...nodes: T[]): number {
    const length = super.unshift(...nodes)
    this.updateIndex()
    return length
  }

  public sort (compareFn?: (a: T, b: T) => number): this {
    super.sort(compareFn)
    this.updateIndex()
    return this
  }

  public reverse (): this {
    super.reverse()
    this.updateIndex()
    return this
  }

  public splice (
    start: number,
    deleteCount?: number,
    ...nodes: T[]): T[] {
    const result = super.splice(start, deleteCount || 0, ...nodes)
    if (start < 0) {
      start = Math.max(0, this.length + start)
    }
    if (deleteCount === nodes.length) {
      this.updateIndex(start, start + deleteCount)
    } else {
      this.updateIndex(start)
    }
    for (const node of result) {
      node.setParent(undefined)
    }
    return result
  }
}

/**
 * A child node.
 */
export class Node implements ChildNode, ParentNode {
  private [PARENT]?: ParentPointer
  public children: Node[] = new NodeArray<Node>(this)

  public get index (): number | undefined {
    const ptr = this[PARENT]
    if (ptr) {
      return ptr.index
    }
  }

  public get parent (): Node | undefined {
    const ptr = this[PARENT]
    if (ptr) {
      return ptr.parent
    }
  }

  private getParent (): ParentPointer {
    const ptr = this[PARENT]
    if (!ptr) {
      throw new Error('This node does not belong to any ParentNode.')
    }
    return ptr
  }

  public setParent (loc?: ParentPointer): void {
    const ptr = this[PARENT]
    if (ptr && loc) {
      if (loc.parent === ptr.parent) {
        ptr.index = loc.index
      } else {
        this.remove()
        this[PARENT] = loc
      }
      return
    }
    this[PARENT] = loc
  }

  public remove (): void {
    const { parent, index } = this.getParent()
    parent.children.splice(index, 1)
  }

  public before (...nodes: Node[]): void {
    const { parent, index } = this.getParent()
    parent.children.splice(index, 0, ...nodes)
  }

  public after (...nodes: Node[]): void {
    const { parent, index } = this.getParent()
    parent.children.splice(index + 1, 0, ...nodes)
  }

  public replaceWith (...nodes: Node[]): void {
    const { parent, index } = this.getParent()
    parent.children.splice(index, 1, ...nodes)
  }

  public append (...nodes: Node[]): void {
    this.children.push(...nodes)
  }

  public prepend (...nodes: Node[]): void {
    this.children.unshift(...nodes)
  }
}
