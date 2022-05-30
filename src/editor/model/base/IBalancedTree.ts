import { Range } from "./Range";

export interface TreeNode {
  parent?: TreeNode;
  leftChild?: TreeNode;
  rightChild?: TreeNode;
  prev?: TreeNode;
  next?: TreeNode;
  leftMost: TreeNode;
  rightMost: TreeNode;
}

export interface IBalancedTree<Node extends TreeNode> {
  /**
   * Return the tree root. Return undefined if the tree is empty.
   */
  root: Node | undefined;

  /**
   * Find target node by position
   * @param pos starts from 0
   * @returns the target node and offset position in the target.
   */
  find(pos: number): { target: Node; start: number; offset: number };

  /**
   * Find the nodes including content between range
   * @param range
   * @returns nodes, startPos, endPos. Nodes are related nodes,
   * startPos is the starting position of the first node, endPos is the ending position of the last node.
   */
  findNodes(range: Range): { nodes: Node[]; startPos: number; endPos: number };

  /**
   * Insert new node. When referenced node is provided, new node could be inserted before or after it.
   * @param newNode
   * @param refNode
   * @param beforeOrAfter
   */
  insert(newNode: Node, refNode?: Node, beforeOrAfter?: boolean): void;

  /**
   * Delete the target node
   * @param node
   */
  delete(node: Node): void;

  /**
   * Provide interface for updating node content on the path from target node to root.
   * @param node
   */
  fixOnPath(node: Node): void;
}
