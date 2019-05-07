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

const NEXT = Symbol('next node')
const PREVIOUS = Symbol('previous node')
const PARENT = Symbol('parent node')
const FIRST = Symbol('first child node')
const LAST = Symbol('last child node')
const LIST = Symbol('node list')

export class NodeList {
  private parent: Node
  public constructor (parent: Node) {
    this.parent = parent
  }

  public * [Symbol.iterator] (): IterableIterator<Node> {
    let node = this.parent[FIRST]
    while (node) {
      yield node
      node = node[NEXT]
    }
  }
}

export class Node implements ChildNode, ParentNode {
  private [NEXT]?: Node
  private [PREVIOUS]?: Node
  private [PARENT]?: Node
  private [FIRST]?: Node
  private [LAST]?: Node
  private [LIST]?: NodeList

  public get children (): NodeList {
    const { [LIST]: list } = this
    if (list) {
      return list
    } else {
      const list = new NodeList(this)
      this[LIST] = list
      return list
    }
  }

  public static takeOver = (parent: Node, items: Node[]): void => {
    for (const item of items) {
      item.remove()
      item[PARENT] = parent
    }
  }

  public static link = (items: Node[]): void => {
    if (items.length > 1) {
      const end = items.length - 1
      for (let i = 1; i < end; i++) {
        const item = items[i]
        item[PREVIOUS] = items[i - 1]
        item[NEXT] = items[i + 1]
      }
      const first = items[0]
      const last = items[items.length - 1]
      first[NEXT] = items[1]
      last[PREVIOUS] = items[items.length - 2]
    }
  }

  public remove (): void {
    const { [PARENT]: parent } = this
    if (!parent) {
      return
    }
    const { [PREVIOUS]: previous, [NEXT]: next } = this
    if (previous) {
      previous[NEXT] = next
    } else {
      parent[FIRST] = next
    }
    if (next) {
      next[PREVIOUS] = previous
    } else {
      parent[LAST] = previous
    }
    this[PREVIOUS] = undefined
    this[NEXT] = undefined
    this[PARENT] = undefined
  }

  public before (...items: Node[]): void {
    const { [PARENT]: parent } = this
    if (!parent || !items.length) {
      return
    }
    Node.takeOver(parent, items)
    const { [PREVIOUS]: previous } = this
    items.push(this)
    Node.link(items)
    if (previous) {
      const first = items[0]
      previous[NEXT] = first
      first[PREVIOUS] = previous
    } else {
      parent[FIRST] = items[0]
    }
  }

  public after (...items: Node[]): void {
    const { [PARENT]: parent } = this
    if (!parent || !items.length) {
      return
    }
    Node.takeOver(parent, items)
    const { [NEXT]: next } = this
    if (next) {
      items.push(next)
    } else {
      parent[LAST] = items[items.length - 1]
    }
    Node.link(items)
    const first = items[0]
    this[NEXT] = first
    first[PREVIOUS] = this
  }

  public replaceWith (...items: Node[]): void {
    const { [PARENT]: parent } = this
    if (!parent) {
      return
    }
    if (!items.length) {
      this.remove()
      return
    }
    Node.takeOver(parent, items)
    const { [PREVIOUS]: previous, [NEXT]: next } = this
    this[PREVIOUS] = undefined
    this[NEXT] = undefined
    this[PARENT] = undefined
    if (next) {
      items.push(next)
    } else {
      parent[LAST] = items[items.length - 1]
    }
    Node.link(items)
    if (previous) {
      const first = items[0]
      previous[NEXT] = first
      first[PREVIOUS] = previous
    } else {
      parent[FIRST] = items[0]
    }
  }

  public append (...items: Node[]): void {
    const { [LAST]: last } = this
    if (last) {
      last.after(...items)
    } else {
      Node.takeOver(this, items)
      this[FIRST] = items[0]
      this[LAST] = items[items.length - 1]
    }
  }

  public prepend (...items: Node[]): void {
    const { [FIRST]: first } = this
    if (first) {
      first.before(...items)
    } else {
      Node.takeOver(this, items)
      this[FIRST] = items[0]
      this[LAST] = items[items.length - 1]
    }
  }
}
