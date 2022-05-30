/**
 * BalanceTree, a self-balancing binary search tree based on red black tree.
 * We name it "Balance" since it has properties "size", "leftSubTreeSize" and "rightSubTreeSize" like a balance.
 * Red black tree visualization: https://www.cs.usfca.edu/~galles/visualization/RedBlack.html
 */

import { IBalancedTree, TreeNode } from "./IBalancedTree";
import { Range } from "./Range";

export enum Color {
  Red = 1,
  Black = 2,
}

export interface BalanceNodeOptions {
  parent?: BalanceNode;
  leftChild?: BalanceNode;
  rightChild?: BalanceNode;
  color?: Color;
  size?: number;
  leftSubTreeSize?: number;
  rightSubTreeSize?: number;
}

export class BalanceNode implements TreeNode {
  public color: Color;
  public leftChild: BalanceNode;
  public rightChild: BalanceNode;
  public parent?: BalanceNode;
  public size: number;
  public leftSubTreeSize: number;
  public rightSubTreeSize: number;

  constructor({
    parent,
    leftChild = NULL,
    rightChild = NULL,
    color = Color.Red,
    size = 0,
    leftSubTreeSize = 0,
    rightSubTreeSize = 0,
  }: BalanceNodeOptions = {}) {
    this.parent = parent;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.color = color;
    this.size = size;
    this.leftSubTreeSize = leftSubTreeSize;
    this.rightSubTreeSize = rightSubTreeSize;
  }

  public get leftMost() {
    let node = this as BalanceNode;
    while (node.leftChild && node.leftChild !== NULL) {
      node = node.leftChild;
    }
    return node;
  }

  public get rightMost() {
    let node = this as BalanceNode;
    while (node.rightChild && node.rightChild !== NULL) {
      node = node.rightChild;
    }
    return node;
  }

  public get totalSize() {
    return this.leftSubTreeSize + this.size + this.rightSubTreeSize;
  }

  public get next(): BalanceNode | undefined {
    if (this.rightChild !== NULL) {
      return this.rightChild.leftMost;
    } else {
      let node = this as BalanceNode;
      while (node.parent && node === node.parent.rightChild) {
        node = node.parent;
      }
      if (node.parent) {
        return node.parent;
      }
    }
  }

  public get prev(): BalanceNode | undefined {
    if (this.leftChild !== NULL) {
      return this.leftChild.rightMost;
    } else {
      let node = this as BalanceNode;
      while (node.parent && node === node.parent.leftChild) {
        node = node.parent;
      }
      if (node.parent) {
        return node.parent;
      }
    }
  }
}

/**
 * There might exist a bug that NULL's parent might refer to any node, making node's parent incorrect
 */
const NULL = new BalanceNode({
  color: Color.Black,
  leftChild: undefined,
  rightChild: undefined,
});

export default class BalanceTree<Node extends BalanceNode>
  implements IBalancedTree<Node> {
  public static isNull(node: BalanceNode) {
    return node === NULL;
  }

  private _root: BalanceNode;

  constructor() {
    this._root = NULL;
  }

  public get root() {
    if (!BalanceTree.isNull(this._root)) {
      return this._root as Node;
    }
  }

  /**
   * Find target node by position
   * @param pos starts from 0
   * @returns
   */
  public find(pos: number) {
    let node = this._root;
    let currentPos = node.leftSubTreeSize;
    while (!BalanceTree.isNull(node)) {
      if (pos >= currentPos && pos <= currentPos + node.size - 1) {
        return {
          target: node as Node,
          start: currentPos,
          offset: pos - currentPos,
        };
      } else if (pos < currentPos) {
        node = node.leftChild;
        currentPos = currentPos - node.rightSubTreeSize - node.size;
      } else {
        currentPos = currentPos + node.size;
        node = node.rightChild;
        currentPos = currentPos + node.leftSubTreeSize;
      }
    }
    throw new Error(`Invalid Parameter: ${pos} is not inside the tree`);
  }

  public findNodes(range: Range) {
    const { target: startNode, offset: startPos } = this.find(range.start);
    let nodes: Node[] = [];
    let endPos = 0;
    let node: Node | undefined = startNode;
    if (!range.isInfinite()) {
      let leftLength = range.length;
      while (leftLength > 0 && node) {
        nodes.push(node);
        const size = node === startNode ? node.size - startPos : node.size;
        if (size >= leftLength) {
          endPos =
            node === startNode ? startPos + leftLength - 1 : leftLength - 1;
          leftLength = leftLength - size;
        } else {
          leftLength -= size;
        }
        node = node.next as Node | undefined;
      }
    } else {
      while (node) {
        nodes.push(node);
        node = node.next as Node | undefined;
      }
      endPos = nodes[nodes.length - 1].size - 1;
    }
    if (nodes.length === 0) {
      throw new Error(`Invalid parameters: range ${range.toString()}, no nodes found.`)
    }
    return {
      nodes,
      startPos,
      endPos,
    };
  }

  public insert(newNode: Node, refNode?: Node, beforeOrAfter?: boolean) {
    let parent = refNode || this._root;
    if (parent === NULL) {
      this._root = newNode;
      newNode.color = Color.Black;
    } else {
      if (beforeOrAfter) {
        if (parent.leftChild !== NULL) {
          parent = parent.leftChild.rightMost;
          parent.rightChild = newNode;
        } else {
          parent.leftChild = newNode;
        }
      } else {
        if (parent.rightChild !== NULL) {
          parent = parent.rightChild.leftMost;
          parent.leftChild = newNode;
        } else {
          parent.rightChild = newNode;
        }
      }
      newNode.parent = parent;
      newNode.color = Color.Red;
      if (newNode.parent.parent) {
        this.fixInsertion(newNode);
      } else {
        this.updateParentSubSize(newNode);
      }
    }
  }

  public delete(node: Node) {
    let substitute: BalanceNode = node;
    let originalColor = substitute.color;
    let child: BalanceNode;
    if (node.leftChild === NULL) {
      child = node.rightChild;
      this.replace(node, node.rightChild);
    } else if (node.rightChild === NULL) {
      child = node.leftChild;
      this.replace(node, node.leftChild);
    } else {
      // here it's okay to replace with the previous node or the next node
      // we take the previous node for alignment with the tree visualization tool
      substitute = node.leftChild.rightMost;
      originalColor = substitute.color;
      child = substitute.leftChild;
      if (substitute.parent === node) {
        child.parent = substitute;
      } else {
        this.replace(substitute, substitute.leftChild);
        substitute.leftChild = node.leftChild;
        substitute.leftChild.parent = substitute;
      }
      this.replace(node, substitute);
      substitute.rightChild = node.rightChild;
      substitute.rightChild.parent = substitute;
      substitute.color = node.color;
      this.updateSubTreeSize(substitute, false);
    }
    if (originalColor === Color.Black) {
      this.fixRemoval(child);
    } else {
      // update nodes along path when it does not need fix
      this.updateAscendantsSubSize(child);
    }
  }

  public fixOnPath(node: Node) {
    this.updateAscendantsSubSize(node);
  }

  private fixInsertion(leaf: BalanceNode) {
    let node: BalanceNode | undefined = leaf;
    let uncle: BalanceNode | undefined;
    while (node?.parent?.parent && node.parent.color === Color.Red) {
      if (node.parent === node.parent.parent.rightChild) {
        uncle = node.parent.parent.leftChild;
        if (uncle.color === Color.Red) {
          uncle.color = Color.Black;
          node.parent.color = Color.Black;
          node.parent.parent.color = Color.Red;
          this.updateParentSubSize(node);
          this.updateParentSubSize(node.parent);
          node = node.parent.parent;
        } else {
          if (node === node.parent.leftChild) {
            this.updateParentSubSize(node);
            node = node.parent;
            this.rotateRight(node);
          }
          if (node.parent) {
            node.parent.color = Color.Black;
          }
          if (node.parent?.parent) {
            node.parent.parent.color = Color.Red;
            this.updateParentSubSize(node);
            this.updateParentSubSize(node.parent);
            this.rotateLeft(node.parent.parent);
          }
        }
      } else {
        uncle = node.parent.parent.rightChild;
        if (uncle.color === Color.Red) {
          uncle.color = Color.Black;
          node.parent.color = Color.Black;
          node.parent.parent.color = Color.Red;
          this.updateParentSubSize(node);
          this.updateParentSubSize(node.parent);
          node = node.parent.parent;
        } else {
          if (node === node.parent.rightChild) {
            this.updateParentSubSize(node);
            node = node.parent;
            this.rotateLeft(node);
          }
          if (node.parent) {
            node.parent.color = Color.Black;
          }
          if (node.parent?.parent) {
            node.parent.parent.color = Color.Red;
            this.updateParentSubSize(node);
            this.updateParentSubSize(node.parent);
            this.rotateRight(node.parent.parent);
          }
        }
      }
    }
    // fix size when node.parent.color === Color.Red
    this.updateAscendantsSubSize(node);
    if (this._root.color === Color.Red) {
      this._root.color = Color.Black;
    }
  }

  /**
   * Rotate left:
   *      o (parent)                       o (parent)
   *       \                                \
   *        o (node)            ->           o (rightChild)
   *         \                              /
   *          o (rightChild)               o (node)
   *         /                              \
   *        o (grandChild)                   o (grandChild)
   */
  private rotateLeft(node: BalanceNode) {
    const rightChild = node.rightChild;
    const parent = node.parent;
    node.parent = rightChild;
    if (rightChild.leftChild !== NULL) {
      rightChild.leftChild.parent = node;
    }
    node.rightChild = rightChild.leftChild;
    rightChild.parent = parent;
    rightChild.leftChild = node;
    if (parent) {
      if (parent.leftChild === node) {
        parent.leftChild = rightChild;
      } else {
        parent.rightChild = rightChild;
      }
    } else {
      this._root = rightChild;
    }

    this.updateSubTreeSize(node, false);
    this.updateSubTreeSize(rightChild, true);
  }

  /**
   * Rotate right
   *         o (parent)                      o (parent)
   *        /                               /
   *       o (node)                        o (leftChild)
   *      /                  ->             \
   *     o (leftChild)                       o (node)
   *      \                                 /
   *       o (grandChild)                  o (grandChild)
   */
  private rotateRight(node: BalanceNode) {
    const leftChild = node.leftChild;
    const parent = node.parent;
    node.parent = leftChild;
    if (leftChild.rightChild !== NULL) {
      leftChild.rightChild.parent = node;
    }
    node.leftChild = leftChild.rightChild;
    leftChild.parent = parent;
    leftChild.rightChild = node;
    if (parent != undefined) {
      if (parent.leftChild === node) {
        parent.leftChild = leftChild;
      } else {
        parent.rightChild = leftChild;
      }
    } else {
      this._root = leftChild;
    }

    this.updateSubTreeSize(node, true);
    this.updateSubTreeSize(leftChild, false);
  }

  private updateSubTreeSize(node: BalanceNode, leftOrRight: boolean) {
    if (leftOrRight) {
      node.leftSubTreeSize =
        node.leftChild === NULL ? 0 : node.leftChild.totalSize;
    } else {
      if (node.rightChild) {
        node.rightSubTreeSize =
          node.rightChild === NULL ? 0 : node.rightChild.totalSize;
      }
    }
  }

  private updateParentSubSize(node: BalanceNode) {
    if (node.parent) {
      if (node === node.parent.leftChild) {
        node.parent.leftSubTreeSize = node === NULL ? 0 : node.totalSize;
      } else {
        node.parent.rightSubTreeSize = node === NULL ? 0 : node.totalSize;
      }
    }
  }

  private updateAscendantsSubSize(child: BalanceNode) {
    let node = child;
    while (node.parent) {
      this.updateParentSubSize(node);
      node = node.parent;
    }
  }

  private fixRemoval(node: BalanceNode) {
    let sibling: BalanceNode;
    while (node.parent && node.color === Color.Black) {
      if (node === node.parent.leftChild) {
        sibling = node.parent.rightChild;
        if (sibling.color === Color.Red) {
          sibling.color = Color.Black;
          node.parent.color = Color.Red;
          this.rotateLeft(node.parent);
          sibling = node.parent.rightChild;
        }
        if (
          sibling.leftChild.color === Color.Black &&
          sibling.rightChild.color === Color.Black
        ) {
          sibling.color = Color.Red;
          this.updateParentSubSize(node);
          node = node.parent;
        } else {
          if (sibling.rightChild.color === Color.Black) {
            sibling.leftChild.color = Color.Black;
            sibling.color = Color.Red;
            this.rotateRight(sibling);
            sibling = node.parent.rightChild;
          }
          sibling.color = node.parent.color;
          node.parent.color = Color.Black;
          sibling.rightChild.color = Color.Black;
          this.rotateLeft(node.parent);
          this.updateAscendantsSubSize(node);
          node = this._root;
        }
      } else {
        sibling = node.parent.leftChild;
        if (sibling.color === Color.Red) {
          sibling.color = Color.Black;
          node.parent.color = Color.Red;
          this.rotateRight(node.parent);
          sibling = node.parent.leftChild;
        }
        if (
          sibling.leftChild.color === Color.Black &&
          sibling.rightChild.color === Color.Black
        ) {
          sibling.color = Color.Red;
          this.updateParentSubSize(node);
          node = node.parent;
        } else {
          if (sibling.leftChild.color === Color.Black) {
            sibling.rightChild.color = Color.Black;
            sibling.color = Color.Red;
            this.rotateLeft(sibling);
            sibling = node.parent.leftChild;
          }
          sibling.color = node.parent.color;
          node.parent.color = Color.Black;
          sibling.leftChild.color = Color.Black;
          this.rotateRight(node.parent);
          this.updateAscendantsSubSize(node);
          node = this._root;
        }
      }
    }
    node.color = Color.Black;
    this.updateAscendantsSubSize(node);
  }

  private replace(oldNode: BalanceNode, newNode: BalanceNode = NULL) {
    const parent = oldNode.parent;
    newNode.parent = parent;
    if (parent) {
      if (oldNode === parent.leftChild) {
        parent.leftChild = newNode;
        this.updateSubTreeSize(parent, true);
      } else {
        parent.rightChild = newNode;
        this.updateSubTreeSize(parent, false);
      }
    } else {
      this._root = newNode;
    }
  }
}
