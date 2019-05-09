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
import { PARENT_CONSTRAINT } from './symbols'

/* reexports */
export { PARENT_CONSTRAINT }

/* code */

/**
 * @public
 */
export interface ChildNode {
  [PARENT_CONSTRAINT]?: (newParent: ChildNode) => void
  parent?: ParentNode
  next?: ChildNode
  previous?: ChildNode
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
  first?: ChildNode
  last?: ChildNode
  append (...items: ChildNode[]): void
  prepend (...items: ChildNode[]): void
}

/**
 * @public
 */
export interface TreeFunctions {
  parent <T extends object> (self: T): T | undefined
  children <T extends object> (self: T): Children<T>
  first <T extends object> (self: T): T | undefined
  last <T extends object> (self: T): T | undefined
  next <T extends object> (self: T): T | undefined
  previous <T extends object> (self: T): T | undefined
  remove <T extends object> (self: T): void
  before <T extends object> (self: T, ...newNodes: T[]): void
  after <T extends object> (self: T, ...newNodes: T[]): void
  replaceWith <T extends object> (self: T, ...newNodes: T[]): void
  append <T extends object> (self: T, ...newNodes: T[]): void
  prepend <T extends object> (self: T, ...newNodes: T[]): void
}
