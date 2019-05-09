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
/* code */

/**
 * @public
 */
export interface ChildNode {
  parent?: ParentNode
  remove (): void
  before (...items: ChildNode[]): void
  after (...items: ChildNode[]): void
  replaceWith (...items: ChildNode[]): void
}

/**
 * @public
 */
export interface Children<T extends object> {
  length: number
  [Symbol.iterator] (): IterableIterator<T>
  values (): IterableIterator<T>
  entries (): IterableIterator<[number, T]>
}

/**
 * @public
 */
export interface ParentNode {
  children: Children<ChildNode>
  firstChild?: ChildNode
  lastChild?: ChildNode
  append (...items: ChildNode[]): void
  prepend (...items: ChildNode[]): void
}

/**
 * @public
 */
export const PARENT_CONSTRAINT = Symbol('parent-constraint')
/**
 * @public
 */
export const PARENT = Symbol('parent')
/**
 * @public
 */
export const NEXT = Symbol('next')
/**
 * @public
 */
export const PREVIOUS = Symbol('previous')
/**
 * @public
 */
export const FIRST = Symbol('first')
/**
 * @public
 */
export const LAST = Symbol('last')
/**
 * @public
 */
export const CHILDREN = Symbol('count')
/**
 * @public
 */
export const COUNT = Symbol('count')

/**
 * @public
 */
export interface TreeFunctions {
  parent <T extends object> (self: T): T | undefined
  children <T extends object> (self: T): Children<T>
  firstChild <T extends object> (self: T): T | undefined
  lastChild <T extends object> (self: T): T | undefined
  nextSibling <T extends object> (self: T): T | undefined
  previousSibling <T extends object> (self: T): T | undefined
  remove <T extends object> (self: T): void
  before <T extends object> (self: T, ...newNodes: T[]): void
  after <T extends object> (self: T, ...newNodes: T[]): void
  replaceWith <T extends object> (self: T, ...newNodes: T[]): void
  append <T extends object> (self: T, ...newNodes: T[]): void
  prepend <T extends object> (self: T, ...newNodes: T[]): void
}
