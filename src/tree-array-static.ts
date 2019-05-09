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
export const PARENT = Symbol('parent')
export const PARENT_CONSTRAINT = Symbol('parent-constraint')
export const CHILDREN = Symbol('children')

interface ParentPointer {
  parent: TreeNode
  index: number
}

interface TreeNode {
  [PARENT_CONSTRAINT]?: (newParent: TreeNode) => void
  [PARENT]?: ParentPointer
  [CHILDREN]?: TreeNode[]
}

const setPointer = <T extends TreeNode>(self: T, ptr?: ParentPointer): void => {
  if (ptr && self[PARENT_CONSTRAINT]) {
    (self[PARENT_CONSTRAINT] as (newParent: TreeNode) => void)(ptr.parent)
  }
  self[PARENT] = ptr
}

const parent = <T extends TreeNode>(self: T): T | undefined => {
  const ptr = self[PARENT]
  if (ptr) {
    return ptr.parent as T
  }
}

const index = <T extends TreeNode>(self: T): number | undefined => {
  const ptr = self[PARENT]
  if (ptr) {
    return ptr.index
  }
}

const children = <T extends TreeNode>(self: T): T[] => {
  const children = self[CHILDREN]
  if (children) {
    return children as T[]
  } else {
    const children: T[] = []
    self[CHILDREN] = children
    return children
  }
}

const firstChild = <T extends TreeNode>(self: T): T | undefined => {
  return children(self)[0] as T
}

const lastChild = <T extends TreeNode>(self: T): T | undefined => {
  const nodes = children(self)
  return nodes[nodes.length - 1] as T
}

const updateIndex = (
  node: TreeNode,
  start: number = 0,
  end: number | undefined = undefined
): void => {
  const nodes = children(node)
  if (end == null) {
    end = nodes.length
  }
  for (let i = start; i < end; ++i) {
    setPointer(nodes[i], {
      parent: node,
      index: i
    })
  }
}

const remove = <T extends TreeNode>(self: T): void => {
  const p = parent(self)
  if (!p) {
    return
  }
  const id = index(self) as number
  setPointer(self)
  children(p).splice(id, 1)
  updateIndex(p, id)
}

const takeOver = <T extends TreeNode>(nodes: T[]): void => {
  for (const node of nodes) {
    remove(node)
  }
}

const before = <T extends TreeNode>(self: T, ...newNodes: T[]): void => {
  const p = parent(self)
  if (!p) {
    return
  }
  const id = index(self) as number
  takeOver(newNodes)
  children(p).splice(id, 0, ...newNodes)
  updateIndex(p, id)
}

const after = <T extends TreeNode>(self: T, ...newNodes: T[]): void => {
  const p = parent(self)
  if (!p) {
    return
  }
  const id = index(self) as number
  takeOver(newNodes)
  children(p).splice(id + 1, 0, ...newNodes)
  updateIndex(p, id + 1)
}

const replaceWith = <T extends TreeNode>(self: T, ...newNodes: T[]): void => {
  const p = parent(self)
  if (!p) {
    return
  }
  const id = index(self) as number
  takeOver(newNodes)
  children(p).splice(id, 1, ...newNodes)
  setPointer(self)
  if (newNodes.length === 1) {
    updateIndex(p, id, id + 1)
  } else {
    updateIndex(p, id)
  }
}

const append = <T extends TreeNode>(self: T, ...newNodes: T[]): void => {
  const nodes = children(self)
  const start = nodes.length
  takeOver(newNodes)
  self[CHILDREN] = nodes.concat(newNodes)
  updateIndex(self, start)
}

const prepend = <T extends TreeNode>(self: T, ...newNodes: T[]): void => {
  takeOver(newNodes)
  self[CHILDREN] = newNodes.concat(children(self))
  updateIndex(self)
}

export default Object.freeze({
  setPointer,
  parent,
  index,
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

export class Node implements TreeNode, ChildNode, ParentNode {
  public [PARENT]?: ParentPointer
  public [CHILDREN]?: TreeNode[]

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
