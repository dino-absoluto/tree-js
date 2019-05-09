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
import {
  ChildNode,
  ParentNode,
  PARENT_CONSTRAINT,
  PARENT,
  CHILDREN,
  TreeFunctions
} from './common'

/* code */

/**
 * @internal
 */
export interface ParentPointer {
  parent: TNode
  index: number
}

/**
 * @internal
 */
export interface TNode {
  [PARENT_CONSTRAINT]?: (newParent: TNode) => void
  [PARENT]?: ParentPointer
  [CHILDREN]?: TNode[]
}

const parent = <T extends TNode>(self: T): T | undefined => {
  const ptr = self[PARENT]
  if (ptr) {
    return ptr.parent as T
  }
}

const index = <T extends TNode>(self: T): number | undefined => {
  const ptr = self[PARENT]
  if (ptr) {
    return ptr.index
  }
}

const children = <T extends TNode>(self: T): T[] => {
  const children = self[CHILDREN]
  if (children) {
    return children as T[]
  } else {
    const children: T[] = []
    self[CHILDREN] = children
    return children
  }
}

const firstChild = <T extends TNode>(self: T): T | undefined => {
  return children(self)[0] as T
}

const lastChild = <T extends TNode>(self: T): T | undefined => {
  const nodes = children(self)
  return nodes[nodes.length - 1] as T
}

const nextSibling = <T extends TNode>(self: T): T | undefined => {
  const ptr = self[PARENT]
  if (!ptr) {
    return
  }
  const p = ptr.parent as T
  const id = ptr.index
  return children(p)[id + 1]
}

const previousSibling = <T extends TNode>(self: T): T | undefined => {
  const ptr = self[PARENT]
  if (!ptr) {
    return
  }
  const p = ptr.parent as T
  const id = ptr.index
  return children(p)[id - 1]
}

const updateIndex = (
  self: TNode,
  start: number = 0,
  end: number | undefined = undefined
): void => {
  const nodes = children(self)
  if (end == null) {
    end = nodes.length
  }
  for (let i = start; i < end; ++i) {
    const node = nodes[i]
    if (node[PARENT_CONSTRAINT]) {
      (node[PARENT_CONSTRAINT] as (newParent: TNode) => void)(self)
    }
    node[PARENT] = {
      parent: self,
      index: i
    }
  }
}

const remove = <T extends TNode>(self: T): void => {
  const ptr = self[PARENT]
  if (!ptr) {
    return
  }
  const p = ptr.parent
  self[PARENT] = undefined
  const id = ptr.index
  children(p).splice(id, 1)
  updateIndex(p, id)
}

const takeOver = <T extends TNode>(nodes: T[]): void => {
  for (const node of nodes) {
    remove(node)
  }
}

const before = <T extends TNode>(self: T, ...newNodes: T[]): void => {
  const ptr = self[PARENT]
  if (!ptr) {
    return
  }
  const p = ptr.parent
  takeOver(newNodes)
  const id = (self[PARENT] as ParentPointer).index
  children(p).splice(id, 0, ...newNodes)
  updateIndex(p, id)
}

const after = <T extends TNode>(self: T, ...newNodes: T[]): void => {
  const ptr = self[PARENT]
  if (!ptr) {
    return
  }
  const p = ptr.parent
  takeOver(newNodes)
  const id = (self[PARENT] as ParentPointer).index
  children(p).splice(id + 1, 0, ...newNodes)
  updateIndex(p, id + 1)
}

const replaceWith = <T extends TNode>(self: T, ...newNodes: T[]): void => {
  const ptr = self[PARENT]
  if (!ptr) {
    return
  }
  const p = ptr.parent
  takeOver(newNodes)
  const id = (self[PARENT] as ParentPointer).index
  children(p).splice(id, 1, ...newNodes)
  self[PARENT] = undefined
  if (newNodes.length === 1) {
    updateIndex(p, id, id + 1)
  } else {
    updateIndex(p, id)
  }
}

const append = <T extends TNode>(self: T, ...newNodes: T[]): void => {
  const nodes = children(self)
  const start = nodes.length
  takeOver(newNodes)
  self[CHILDREN] = nodes.concat(newNodes)
  updateIndex(self, start)
}

const prepend = <T extends TNode>(self: T, ...newNodes: T[]): void => {
  takeOver(newNodes)
  self[CHILDREN] = newNodes.concat(children(self))
  updateIndex(self)
}

/**
 * @public
 */
const fns: TreeFunctions = Object.freeze({
  parent,
  children,
  firstChild,
  lastChild,
  nextSibling,
  previousSibling,
  remove,
  before,
  after,
  replaceWith,
  append,
  prepend
})
export default fns

/**
 * @public
 */
export class Node implements ChildNode, ParentNode {
  /** @internal */
  public [PARENT]?: ParentPointer
  /** @internal */
  public [CHILDREN]?: TNode[]

  public get parent (): Node | undefined {
    return parent(this)
  }

  public get index (): number | undefined {
    return index(this)
  }

  public get children (): Node[] {
    return children(this)
  }

  public get firstChild (): Node | undefined {
    return firstChild(this)
  }

  public get lastChild (): Node | undefined {
    return lastChild(this)
  }

  public get nextSibling (): Node | undefined {
    return nextSibling(this)
  }

  public get previousSibling (): Node | undefined {
    return previousSibling(this)
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
