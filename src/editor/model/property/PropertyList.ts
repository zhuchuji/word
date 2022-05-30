/**
 * PropertyList is the sequential property collection
 */
import { IBalancedTree } from '../base/IBalancedTree';
import BalanceTree, { BalanceNode } from "../base/BalanceTree";
import { Range } from "../base/Range";
import { Iterator } from './Iterator';
import { PropertyNode } from './PropertyNode';
import { Property } from './Property';

export interface InsertOptions<PropertyType extends Property> {
  range: Range;
  text: string;
  property: PropertyType;
}

export interface ModifyOptions<PropertyType extends Property> {
  range: Range;
  property: PropertyType;
}

export interface DeleteOptions {
  range: Range;
}

export interface PropertyList<PropertyType extends Property> {
  createIterator(limit?: Range): Iterator<PropertyType>;
  onInsert(options: InsertOptions<PropertyType>): void;
  onDelete(options: DeleteOptions): void;
  onModify(options: ModifyOptions<PropertyType>): void;
}

export class PropertyListBase<PropertyType extends Property = Property> {
  protected tree: IBalancedTree<PropertyNode<PropertyType>>;

  constructor() {
    this.tree = new BalanceTree();
  }

  public enlarge(target: PropertyNode<PropertyType>, length: number) {
    target.size += length;
    this.tree.fixOnPath(target);
  }

  public modify(range: Range, property: PropertyType) {
    const { nodes, startPos, endPos } = this.tree.findNodes(range);
  }

  public deleteAndCompact(range: Range) {
    const { nodes } = this.tree.findNodes(range);
    let prev: PropertyNode<PropertyType> | null = null;
    let next: PropertyNode<PropertyType> | null = null;
    if (nodes.length > 0) {
      prev = nodes[0].prev as PropertyNode<PropertyType> | null;
      next = nodes[nodes.length - 1].next as PropertyNode<PropertyType> | null;
    }
    if (prev && next && prev.next === next) {
      this.compact(prev, next);
    } else {
      if (prev) {
        const nextNode = prev.next as PropertyNode<PropertyType> | null;
        if (nextNode) {
          this.compact(prev, nextNode);
        }
      }
      if (next) {
        const prevNode = next.prev as PropertyNode<PropertyType> | null;
        if (prevNode && prevNode !== prev) {
          this.compact(next, prevNode);
        }
      }
    }
  }

  private delete(range: Range): void {
    const { nodes, startPos, endPos } = this.tree.findNodes(range);
    let prev: PropertyNode<PropertyType> | null = null;
    let next: PropertyNode<PropertyType> | null = null;
    if (nodes.length === 1) {
      if (startPos === 0 && endPos === nodes[0].size - 1) {
        prev = nodes[0].prev as PropertyNode<PropertyType> | null;
        next = nodes[0].next as PropertyNode<PropertyType> | null;
      } else {
        prev = nodes[0];
        next = nodes[0].next as PropertyNode<PropertyType> | null;
      }
    } else if (nodes.length > 1) {
      prev = nodes[0].prev as PropertyNode<PropertyType> | null;
      next = nodes[0].next as PropertyNode<PropertyType> | null;
    }
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      const start = i === 0 ? startPos : 0;
      let end = i === nodes.length - 1 ? endPos : node.size - 1;
      if (start === 0 && end === node.size - 1) {
        this.tree.delete(node);
      } else {
        node.size = node.size - (end - start + 1);
        this.tree.fixOnPath(node);
      }
    }
  }

  private compact(current: PropertyNode<PropertyType>, target: PropertyNode<PropertyType>) {
    if (current.property.isSame(target.property)) {
      const size = target.size;
      this.tree.delete(target);
      this.enlarge(current, size);
    }
  }
}
