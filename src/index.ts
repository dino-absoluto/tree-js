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
import Link, {
  Node as LinkNode,
  TNode as _LinkTNode,
  NodeList as _LinkNodeList
} from './tree-link'

import Linear, {
  Node as LinearNode,
  TNode as _LinearTNode,
  ParentPointer as _LinearParentPointer
} from './tree-array'

/* reexports */
export * from './common'
export {
  Link,
  LinkNode,
  _LinkTNode,
  _LinkNodeList
}
export {
  Linear,
  LinearNode,
  _LinearTNode,
  _LinearParentPointer
}

/* code */
