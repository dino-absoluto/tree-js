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

export const PARENT_CONSTRAINT = Symbol('parent-constraint')
export const PARENT = Symbol('parent')
export const NEXT = Symbol('next')
export const PREVIOUS = Symbol('previous')

export const FIRST = Symbol('first')
export const LAST = Symbol('last')
export const CHILDREN = Symbol('count')
export const COUNT = Symbol('count')

interface TNode {
  /* child data */
  [PARENT_CONSTRAINT]?: (newParent: TNode) => void
  [PARENT]?: TNode
  [NEXT]?: TNode
  [PREVIOUS]?: TNode
  /* parent data */
  [FIRST]?: TNode
  [LAST]?: TNode
  [CHILDREN]?: NodeList<TNode>
  [COUNT]?: number
}

export class NodeList<T extends TNode> {
  private parent: T
  public constructor (parent: T) {
    this.parent = parent
  }

  public * [Symbol.iterator] (): IterableIterator<T> {
    yield * this.values()
  }

  public get length (): number {
    return this.parent[COUNT] || 0
  }

  public * values (): IterableIterator<T> {
    const count = this.length
    let node = this.parent[FIRST]
    for (let i = 0; i < count; ++i) {
      yield node as T
      node = (node as T)[NEXT]
    }
  }

  public * valuesRight (): IterableIterator<T> {
    const count = this.length
    let node = this.parent[LAST]
    for (let i = count - 1; i >= 0; --i) {
      yield node as T
      node = (node as T)[PREVIOUS]
    }
  }

  public * entries (): IterableIterator<[number, T]> {
    const count = this.length
    let node = this.parent[FIRST]
    for (let i = 0; i < count; ++i) {
      yield [i, node as T]
      node = (node as T)[NEXT]
    }
  }

  public * entriesRight (): IterableIterator<[number, T]> {
    const count = this.length
    let node = this.parent[LAST]
    for (let i = count - 1; i >= 0; --i) {
      yield [i, node as T]
      node = (node as T)[PREVIOUS]
    }
  }
}

const parent = <T extends TNode> (self: T): T | undefined => {
  return self[PARENT] as T
}

const children = <T extends TNode> (self: T): NodeList<T> => {
  const nodes = self[CHILDREN]
  if (nodes) {
    return nodes as NodeList<T>
  } else {
    const nodes = new NodeList<T>(self)
    self[CHILDREN] = nodes
    return nodes
  }
}

const firstChild = <T extends TNode> (self: T): T | undefined => {
  return self[FIRST] as T
}

const lastChild = <T extends TNode> (self: T): T | undefined => {
  return self[LAST] as T
}

const remove = <T extends TNode> (self: T): void => {
  const { [PARENT]: parent } = self
  if (!parent) {
    return
  }
  const { [PREVIOUS]: previous, [NEXT]: next } = self
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
  self[PREVIOUS] = undefined
  self[NEXT] = undefined
  self[PARENT] = undefined
  parent[COUNT] = parent[COUNT] as number - 1
}

const takeOver = <T extends TNode> (self: T, newNodes: T[]): void => {
  const length = newNodes.length
  let last: T | undefined
  for (let i = 0; i < length; ++i) {
    const node = newNodes[i]
    remove(node)
    node[PREVIOUS] = last
    node[NEXT] = newNodes[i + 1]
    if (node[PARENT_CONSTRAINT]) {
      (node[PARENT_CONSTRAINT] as (newParent: TNode) => void)(self)
    }
    node[PARENT] = self
    last = node
  }
}

const before = <T extends TNode> (self: T, ...newNodes: T[]): void => {
  const { [PARENT]: parent } = self
  if (!parent) {
    return
  }
  if (!newNodes.length) {
    return
  }
  parent[COUNT] = parent[COUNT] as number + newNodes.length
  const { [PREVIOUS]: previous } = self
  takeOver(self, newNodes)
  const first = newNodes[0]
  const last = newNodes[newNodes.length - 1]
  last[NEXT] = self
  self[PREVIOUS] = last
  if (previous) {
    previous[NEXT] = first
    first[PREVIOUS] = previous
  } else {
    parent[FIRST] = first
  }
}

const after = <T extends TNode> (self: T, ...newNodes: T[]): void => {
  const { [PARENT]: parent } = self
  if (!parent || !newNodes.length) {
    return
  }
  parent[COUNT] = parent[COUNT] as number + newNodes.length
  const { [NEXT]: next } = self
  takeOver(self, newNodes)
  const first = newNodes[0]
  const last = newNodes[newNodes.length - 1]
  self[NEXT] = first
  first[PREVIOUS] = self
  if (next) {
    last[NEXT] = next
    next[PREVIOUS] = last
  } else {
    parent[LAST] = last
  }
}

const replaceWith = <T extends TNode> (self: T, ...newNodes: T[]): void => {
  const { [PARENT]: parent } = self
  if (!parent || !newNodes.length) {
    return
  }
  parent[COUNT] = parent[COUNT] as number + newNodes.length - 1
  const { [PREVIOUS]: previous, [NEXT]: next } = self
  remove(self)
  takeOver(self, newNodes)
  const first = newNodes[0]
  const last = newNodes[newNodes.length - 1]
  if (next) {
    last[NEXT] = next
    next[PREVIOUS] = last
  } else {
    parent[LAST] = last
  }
  if (previous) {
    previous[NEXT] = first
    first[PREVIOUS] = previous
  } else {
    parent[FIRST] = first
  }
}

const append = <T extends TNode> (self: T, ...newNodes: T[]): void => {
  const { [LAST]: last } = self
  if (last) {
    after(last, ...newNodes)
  } else {
    self[COUNT] = newNodes.length
    takeOver(self, newNodes)
    self[FIRST] = newNodes[0]
    self[LAST] = newNodes[newNodes.length - 1]
  }
}

const prepend = <T extends TNode> (self: T, ...newNodes: T[]): void => {
  const { [FIRST]: first } = self
  if (first) {
    before(first, ...newNodes)
  } else {
    self[COUNT] = newNodes.length
    takeOver(self, newNodes)
    self[FIRST] = newNodes[0]
    self[LAST] = newNodes[newNodes.length - 1]
  }
}

export default Object.freeze({
  parent,
  children,
  firstChild,
  lastChild,
  remove,
  before,
  after,
  replaceWith,
  append,
  prepend
})

export class Node implements TNode, ChildNode, ParentNode {
  /* child data */
  public [NEXT]?: TNode
  public [PREVIOUS]?: TNode
  public [PARENT]?: TNode
  /* parent data */
  public [FIRST]?: TNode
  public [LAST]?: TNode
  public [CHILDREN]?: NodeList<TNode>
  public [COUNT]?: number

  public get parent (): Node | undefined {
    return parent(this)
  }

  public get children (): NodeList<Node> {
    return children(this)
  }

  public get firstChild (): Node | undefined {
    return firstChild(this)
  }

  public get lastChild (): Node | undefined {
    return lastChild(this)
  }

  public remove (): void {
    remove(this)
  }

  public before (...nodes: Node[]): void {
    before(this, ...nodes)
  }

  public after (...nodes: Node[]): void {
    after(this, ...nodes)
  }

  public replaceWith (...nodes: Node[]): void {
    replaceWith(this, ...nodes)
  }

  public append (...nodes: Node[]): void {
    append(this, ...nodes)
  }

  public prepend (...nodes: Node[]): void {
    prepend(this, ...nodes)
  }
}
