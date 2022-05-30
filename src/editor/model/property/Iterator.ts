/**
 * Iterator for accessing property list.
 * We must use iterator instance once at a time, as the visiting order will be incorrect when the property list change.
 */
import { IBalancedTree } from "../base/IBalancedTree";
import { Range } from '../base/Range';
import { PropertyNode } from "./PropertyNode";
import { Property } from './Property';

// export interface Iterator<PropertyType> {
//   hasNext(): boolean;
//   getNext(): PropertyNode<PropertyType>;
//   seek(pos: number): void;
// }

export class Iterator<PropertyType extends Property> {
  protected tree: IBalancedTree<PropertyNode<PropertyType>>;
  protected limit?: Range;
  protected currentNode?: PropertyNode;

  constructor(tree: IBalancedTree<PropertyNode<PropertyType>>, limit?: Range) {
    this.tree = tree;
    this.limit = limit;
    if (this.limit) {
      this.find(this.limit.start);
    } else {
      this.currentNode = this.tree.root;
    }
  }

  public find(pos: number) {
    const { target } = this.tree.find(pos);
    this.currentNode = target;
    const { leftSubTreeSize, size } = this.currentNode;
    const range = new Range(leftSubTreeSize, leftSubTreeSize + size);
    if (this.limit && !this.limit.isIntersecting(range)) {
      const { start, end } = this.limit;
      throw new Error(`Invalid Parameter: pos-${pos} is out of limit (${start},${end})`);
    }
  }

  public hasNext(): boolean {
    if (this.currentNode) {
      const nextNode = this.currentNode.next as PropertyNode<PropertyType> | undefined;
      if (nextNode) {
        const range = nextNode.getRange();
        if (this.limit && !this.limit.isIntersecting(range)) {
          return false;
        }
        return true;
      }
      return false;
    } else {
      throw new Error('The pointer node does not exist! Set the pointer first');
    }
  }

  public getNext(): PropertyNode<PropertyType> | undefined {
    if (this.hasNext()) {
      return this.currentNode?.next as PropertyNode<PropertyType>;
    }
  }
}
