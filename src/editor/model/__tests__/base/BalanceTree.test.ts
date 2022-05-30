import BalanceTree, {
  BalanceNode,
  BalanceNodeOptions,
  Color,
} from "../../base/BalanceTree";
import { Range } from "../../base/Range";

class TreeNode extends BalanceNode {
  public value: number;

  constructor(options: BalanceNodeOptions & { value?: number } = {}) {
    const { value, ...others } = options;
    super(others);
    this.value = value || 0;
  }
}

class Height {
  public depth: number = 0;
}

function isBalanced(
  node: BalanceNode | undefined,
  maxHeight: Height = new Height(),
  minHeight: Height = new Height()
) {
  if (node === undefined) {
    maxHeight.depth = 0;
    minHeight.depth = 0;
    return true;
  }

  const leftChildMaxHeight = new Height();
  const leftChildMinHeight = new Height();
  const rightChildMaxHeight = new Height();
  const rightChildMinHeight = new Height();

  if (!isBalanced(node.leftChild, leftChildMaxHeight, leftChildMinHeight)) {
    return false;
  }

  if (!isBalanced(node.rightChild, rightChildMaxHeight, rightChildMinHeight)) {
    return false;
  }

  maxHeight.depth =
    Math.max(leftChildMaxHeight.depth, rightChildMaxHeight.depth) + 1;
  minHeight.depth =
    Math.min(leftChildMinHeight.depth, rightChildMinHeight.depth) + 1;
  if (maxHeight.depth <= minHeight.depth * 2) {
    return true;
  }

  return false;
}

let tree: BalanceTree<TreeNode>;
beforeEach(() => {
  tree = new BalanceTree();
});

describe("method: insert", () => {
  test("insert one node", () => {
    const node1 = new TreeNode({ value: 1 });
    tree.insert(node1);
    expect(tree.root).toBe(node1);
  });

  test("insert three nodes and fix with right rotate", () => {
    const node1 = new TreeNode({ value: 1, size: 1 });
    const node2 = new TreeNode({ value: 2, size: 2 });
    const node3 = new TreeNode({ value: 3, size: 3 });
    tree.insert(node3);
    tree.insert(node2, node3, true);
    tree.insert(node1, node2, true);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root).toBe(node2);
    expect(tree.root?.leftChild).toBe(node1);
    expect(tree.root?.rightChild).toBe(node3);
    expect(node1.color).toBe(Color.Red);
    expect(node3.color).toBe(Color.Red);
    expect(node2.leftSubTreeSize).toBe(1);
    expect(node2.rightSubTreeSize).toBe(3);
  });

  test("insert three nodes and fix with left rotate", () => {
    const node1 = new TreeNode({ value: 1, size: 1 });
    const node2 = new TreeNode({ value: 2, size: 2 });
    const node3 = new TreeNode({ value: 3, size: 3 });
    tree.insert(node1);
    tree.insert(node2, node1, false);
    tree.insert(node3, node2, false);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root).toBe(node2);
    expect(tree.root?.leftChild).toBe(node1);
    expect(tree.root?.rightChild).toBe(node3);
    expect(node1.color).toBe(Color.Red);
    expect(node3.color).toBe(Color.Red);
    expect(node2.leftSubTreeSize).toBe(1);
    expect(node2.rightSubTreeSize).toBe(3);
  });

  test("insert three nodes and fix with left-right rotate", () => {
    const node1 = new TreeNode({ value: 1, size: 1 });
    const node2 = new TreeNode({ value: 2, size: 2 });
    const node3 = new TreeNode({ value: 3, size: 3 });
    tree.insert(node3);
    tree.insert(node1, node3, true);
    tree.insert(node2, node3, true);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root).toBe(node2);
    expect(tree.root?.leftChild).toBe(node1);
    expect(tree.root?.rightChild).toBe(node3);
    expect(node1.color).toBe(Color.Red);
    expect(node3.color).toBe(Color.Red);
    expect(node2.leftSubTreeSize).toBe(1);
    expect(node2.rightSubTreeSize).toBe(3);
  });

  test("insert three nodes and fix with right-left rotate", () => {
    const node1 = new TreeNode({ value: 1, size: 1 });
    const node2 = new TreeNode({ value: 2, size: 2 });
    const node3 = new TreeNode({ value: 3, size: 3 });
    tree.insert(node1);
    tree.insert(node3, node1, false);
    tree.insert(node2, node1, false);
    expect(tree.root).toBe(node2);
    expect(tree.root?.leftChild).toBe(node1);
    expect(tree.root?.rightChild).toBe(node3);
    expect(node1.color).toBe(Color.Red);
    expect(node3.color).toBe(Color.Red);
    expect(node2.leftSubTreeSize).toBe(1);
    expect(node2.rightSubTreeSize).toBe(3);
  });

  test("insert eight nodes in asc order", () => {
    const node1 = new TreeNode({ value: 1, size: 1 });
    const node2 = new TreeNode({ value: 2, size: 2 });
    const node3 = new TreeNode({ value: 3, size: 3 });
    const node4 = new TreeNode({ value: 4, size: 4 });
    const node5 = new TreeNode({ value: 5, size: 5 });
    const node6 = new TreeNode({ value: 6, size: 6 });
    const node7 = new TreeNode({ value: 7, size: 7 });
    const node8 = new TreeNode({ value: 8, size: 8 });
    tree.insert(node1);
    tree.insert(node2, node1);
    tree.insert(node3, node2);
    tree.insert(node4, node3);
    tree.insert(node5, node4);
    tree.insert(node6, node5);
    tree.insert(node7, node6);
    tree.insert(node8, node7);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root).toBe(node4);
    expect(tree.root?.leftChild).toBe(node2);
    expect(node2.color).toBe(Color.Red);
    expect(tree.root?.leftChild?.leftChild).toBe(node1);
    expect(node1.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.rightChild).toBe(node3);
    expect(node3.color).toBe(Color.Black);
    expect(tree.root?.rightChild).toBe(node6);
    expect(node6.color).toBe(Color.Red);
    expect(tree.root?.rightChild?.leftChild).toBe(node5);
    expect(node5.color).toBe(Color.Black);
    expect(tree.root?.rightChild?.rightChild).toBe(node7);
    expect(node7.color).toBe(Color.Black);
    expect(tree.root?.rightChild?.rightChild?.rightChild).toBe(node8);
    expect(node8.color).toBe(Color.Red);
    expect(node4.leftSubTreeSize).toBe(6);
    expect(node4.rightSubTreeSize).toBe(26);
    expect(node2.leftSubTreeSize).toBe(1);
    expect(node2.rightSubTreeSize).toBe(3);
    expect(node6.leftSubTreeSize).toBe(5);
    expect(node6.rightSubTreeSize).toBe(15);
    expect(node7.rightSubTreeSize).toBe(8);
  });

  test("insert eight nodes in desc order", () => {
    const node1 = new TreeNode({ value: 1, size: 1 });
    const node2 = new TreeNode({ value: 2, size: 2 });
    const node3 = new TreeNode({ value: 3, size: 3 });
    const node4 = new TreeNode({ value: 4, size: 4 });
    const node5 = new TreeNode({ value: 5, size: 5 });
    const node6 = new TreeNode({ value: 6, size: 6 });
    const node7 = new TreeNode({ value: 7, size: 7 });
    const node8 = new TreeNode({ value: 8, size: 8 });
    tree.insert(node8);
    tree.insert(node7, node8, true);
    tree.insert(node6, node7, true);
    tree.insert(node5, node6, true);
    tree.insert(node4, node5, true);
    tree.insert(node3, node4, true);
    tree.insert(node2, node3, true);
    tree.insert(node1, node2, true);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root).toBe(node5);
    expect(tree.root?.leftChild).toBe(node3);
    expect(node3.color).toBe(Color.Red);
    expect(tree.root?.leftChild?.leftChild).toBe(node2);
    expect(node2.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.leftChild?.leftChild).toBe(node1);
    expect(node1.color).toBe(Color.Red);
    expect(tree.root?.leftChild?.rightChild).toBe(node4);
    expect(node4.color).toBe(Color.Black);
    expect(tree.root?.rightChild).toBe(node7);
    expect(node7.color).toBe(Color.Red);
    expect(tree.root?.rightChild?.leftChild).toBe(node6);
    expect(node6.color).toBe(Color.Black);
    expect(tree.root?.rightChild?.rightChild).toBe(node8);
    expect(node8.color).toBe(Color.Black);
    expect(node5.leftSubTreeSize).toBe(10);
    expect(node5.rightSubTreeSize).toBe(21);
    expect(node3.leftSubTreeSize).toBe(3);
    expect(node3.rightSubTreeSize).toBe(4);
    expect(node2.leftSubTreeSize).toBe(1);
    expect(node7.leftSubTreeSize).toBe(6);
    expect(node7.rightSubTreeSize).toBe(8);
  });

  test("insert eight nodes in random 1", () => {
    const node1 = new TreeNode({ value: 1, size: 1 });
    const node2 = new TreeNode({ value: 2, size: 2 });
    const node3 = new TreeNode({ value: 3, size: 3 });
    const node4 = new TreeNode({ value: 4, size: 4 });
    const node5 = new TreeNode({ value: 5, size: 5 });
    const node6 = new TreeNode({ value: 6, size: 6 });
    const node7 = new TreeNode({ value: 7, size: 7 });
    const node8 = new TreeNode({ value: 8, size: 8 });
    tree.insert(node1);
    tree.insert(node5, node1);
    tree.insert(node2, node1);
    tree.insert(node7, node5);
    tree.insert(node3, node2);
    tree.insert(node4, node5, true);
    tree.insert(node8, node7);
    tree.insert(node6, node7, true);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root).toBe(node2);
    expect(tree.root?.leftChild).toBe(node1);
    expect(node1.color).toBe(Color.Black);
    expect(tree.root?.rightChild).toBe(node5);
    expect(node5.color).toBe(Color.Red);
    expect(tree.root?.rightChild?.leftChild).toBe(node3);
    expect(node3.color).toBe(Color.Black);
    expect(tree.root?.rightChild?.leftChild?.rightChild).toBe(node4);
    expect(node4.color).toBe(Color.Red);
    expect(tree.root?.rightChild?.rightChild).toBe(node7);
    expect(node7.color).toBe(Color.Black);
    expect(tree.root?.rightChild?.rightChild?.leftChild).toBe(node6);
    expect(node6.color).toBe(Color.Red);
    expect(tree.root?.rightChild?.rightChild?.rightChild).toBe(node8);
    expect(node8.color).toBe(Color.Red);
    expect(node2.leftSubTreeSize).toBe(1);
    expect(node2.rightSubTreeSize).toBe(33);
    expect(node5.leftSubTreeSize).toBe(7);
    expect(node5.rightSubTreeSize).toBe(21);
    expect(node3.rightSubTreeSize).toBe(4);
    expect(node7.leftSubTreeSize).toBe(6);
    expect(node7.rightSubTreeSize).toBe(8);
  });

  test("insert eight nodes in random 2", () => {
    const node1 = new TreeNode({ value: 1, size: 1 });
    const node2 = new TreeNode({ value: 2, size: 2 });
    const node3 = new TreeNode({ value: 3, size: 3 });
    const node4 = new TreeNode({ value: 4, size: 4 });
    const node5 = new TreeNode({ value: 5, size: 5 });
    const node6 = new TreeNode({ value: 6, size: 6 });
    const node7 = new TreeNode({ value: 7, size: 7 });
    const node8 = new TreeNode({ value: 8, size: 8 });
    tree.insert(node5);
    tree.insert(node1, node5, true);
    tree.insert(node7, node5);
    tree.insert(node3, node5, true);
    tree.insert(node6, node5);
    tree.insert(node2, node3, true);
    tree.insert(node4, node5, true);
    tree.insert(node8, node7);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root).toBe(node5);
    expect(tree.root?.leftChild).toBe(node2);
    expect(node2.color).toBe(Color.Red);
    expect(tree.root?.leftChild?.leftChild).toBe(node1);
    expect(node1.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.rightChild).toBe(node3);
    expect(node3.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.rightChild?.rightChild).toBe(node4);
    expect(node4.color).toBe(Color.Red);
    expect(tree.root?.rightChild).toBe(node7);
    expect(node7.color).toBe(Color.Black);
    expect(tree.root?.rightChild?.leftChild).toBe(node6);
    expect(node6.color).toBe(Color.Red);
    expect(tree.root?.rightChild?.rightChild).toBe(node8);
    expect(node8.color).toBe(Color.Red);
    expect(node5.leftSubTreeSize).toBe(10);
    expect(node5.rightSubTreeSize).toBe(21);
    expect(node2.leftSubTreeSize).toBe(1);
    expect(node2.rightSubTreeSize).toBe(7);
    expect(node3.rightSubTreeSize).toBe(4);
    expect(node7.leftSubTreeSize).toBe(6);
    expect(node7.rightSubTreeSize).toBe(8);
  });

  test("insert sixteen nodes in random 1", () => {
    const node1 = new TreeNode({ value: 1, size: 1 });
    const node2 = new TreeNode({ value: 2, size: 2 });
    const node3 = new TreeNode({ value: 3, size: 3 });
    const node4 = new TreeNode({ value: 4, size: 4 });
    const node5 = new TreeNode({ value: 5, size: 5 });
    const node6 = new TreeNode({ value: 6, size: 6 });
    const node7 = new TreeNode({ value: 7, size: 7 });
    const node8 = new TreeNode({ value: 8, size: 8 });
    const node9 = new TreeNode({ value: 9, size: 9 });
    const node10 = new TreeNode({ value: 10, size: 10 });
    const node11 = new TreeNode({ value: 11, size: 11 });
    const node12 = new TreeNode({ value: 12, size: 12 });
    const node13 = new TreeNode({ value: 13, size: 13 });
    const node14 = new TreeNode({ value: 14, size: 14 });
    const node15 = new TreeNode({ value: 15, size: 15 });
    const node16 = new TreeNode({ value: 16, size: 16 });
    tree.insert(node10);
    tree.insert(node6, node10, true);
    tree.insert(node13, node10);
    tree.insert(node1, node6, true);
    tree.insert(node9, node10, true);
    tree.insert(node7, node6);
    tree.insert(node3, node6, true);
    tree.insert(node4, node6, true);
    tree.insert(node15, node13);
    tree.insert(node5, node6, true);
    tree.insert(node16, node15);
    tree.insert(node2, node3, true);
    tree.insert(node12, node13, true);
    tree.insert(node8, node7);
    tree.insert(node11, node10);
    tree.insert(node14, node15, true);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root).toBe(node6);
    expect(tree.root?.leftChild).toBe(node3);
    expect(tree.root?.leftChild?.leftChild).toBe(node1);
    expect(tree.root?.leftChild?.leftChild?.rightChild).toBe(node2);
    expect(tree.root?.leftChild?.rightChild).toBe(node4);
    expect(tree.root?.leftChild?.rightChild?.rightChild).toBe(node5);
    expect(tree.root?.rightChild).toBe(node12);
    expect(tree.root?.rightChild?.leftChild).toBe(node10);
    expect(tree.root?.rightChild?.leftChild?.leftChild).toBe(node8);
    expect(tree.root?.rightChild?.leftChild?.leftChild?.leftChild).toBe(node7);
    expect(tree.root?.rightChild?.leftChild?.leftChild?.rightChild).toBe(node9);
    expect(tree.root?.rightChild?.leftChild?.rightChild).toBe(node11);
    expect(tree.root?.rightChild?.rightChild).toBe(node15);
    expect(tree.root?.rightChild?.rightChild?.leftChild).toBe(node13);
    expect(tree.root?.rightChild?.rightChild?.leftChild?.rightChild).toBe(
      node14
    );
    expect(tree.root?.rightMost).toBe(node16);
    expect(node1.rightSubTreeSize).toBe(2);
    expect(node3.leftSubTreeSize).toBe(3);
    expect(node3.rightSubTreeSize).toBe(9);
    expect(node4.rightSubTreeSize).toBe(5);
    expect(node6.leftSubTreeSize).toBe(15);
    expect(node13.rightSubTreeSize).toBe(14);
    expect(node15.leftSubTreeSize).toBe(27);
    expect(node15.rightSubTreeSize).toBe(16);
    expect(node8.leftSubTreeSize).toBe(7);
    expect(node8.rightSubTreeSize).toBe(9);
    expect(node10.leftSubTreeSize).toBe(24);
    expect(node10.rightSubTreeSize).toBe(11);
    expect(node12.leftSubTreeSize).toBe(45);
    expect(node12.rightSubTreeSize).toBe(58);
    expect(node6.rightSubTreeSize).toBe(115);
  });

  test("insert sixteen nodes in random 2", () => {
    const node1 = new TreeNode({ value: 1, size: 1 });
    const node2 = new TreeNode({ value: 2, size: 2 });
    const node3 = new TreeNode({ value: 3, size: 3 });
    const node4 = new TreeNode({ value: 4, size: 4 });
    const node5 = new TreeNode({ value: 5, size: 5 });
    const node6 = new TreeNode({ value: 6, size: 6 });
    const node7 = new TreeNode({ value: 7, size: 7 });
    const node8 = new TreeNode({ value: 8, size: 8 });
    const node9 = new TreeNode({ value: 9, size: 9 });
    const node10 = new TreeNode({ value: 10, size: 10 });
    const node11 = new TreeNode({ value: 11, size: 11 });
    const node12 = new TreeNode({ value: 12, size: 12 });
    const node13 = new TreeNode({ value: 13, size: 13 });
    const node14 = new TreeNode({ value: 14, size: 14 });
    const node15 = new TreeNode({ value: 15, size: 15 });
    const node16 = new TreeNode({ value: 16, size: 16 });
    tree.insert(node3);
    tree.insert(node10, node3);
    tree.insert(node1, node3, true);
    tree.insert(node12, node10);
    tree.insert(node2, node3, true);
    tree.insert(node4, node3);
    tree.insert(node7, node10, true);
    tree.insert(node6, node7, true);
    tree.insert(node16, node12);
    tree.insert(node15, node12);
    tree.insert(node9, node10, true);
    tree.insert(node8, node9, true);
    tree.insert(node11, node10);
    tree.insert(node5, node6, true);
    tree.insert(node13, node12);
    tree.insert(node14, node15, true);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root).toBe(node6);
    expect(tree.root?.leftChild).toBe(node3);
    expect(node3.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.leftChild).toBe(node1);
    expect(node1.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.leftChild?.rightChild).toBe(node2);
    expect(node2.color).toBe(Color.Red);
    expect(tree.root?.leftChild?.rightChild).toBe(node4);
    expect(node4.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.rightChild?.rightChild).toBe(node5);
    expect(node5.color).toBe(Color.Red);
    expect(tree.root?.rightChild).toBe(node12);
    expect(node12.color).toBe(Color.Black);
    expect(tree.root?.rightChild?.leftChild).toBe(node10);
    expect(node10.color).toBe(Color.Red);
    expect(tree.root?.rightChild?.leftChild?.leftChild).toBe(node8);
    expect(node8.color).toBe(Color.Black);
    expect(tree.root?.rightChild?.leftChild?.leftChild?.leftChild).toBe(node7);
    expect(node7.color).toBe(Color.Red);
    expect(tree.root?.rightChild?.leftChild?.leftChild?.rightChild).toBe(node9);
    expect(node9.color).toBe(Color.Red);
    expect(tree.root?.rightChild?.leftChild?.rightChild).toBe(node11);
    expect(node11.color).toBe(Color.Black);
    expect(tree.root?.rightChild?.rightChild).toBe(node15);
    expect(node15.color).toBe(Color.Red);
    expect(tree.root?.rightChild?.rightChild?.leftChild).toBe(node13);
    expect(node13.color).toBe(Color.Black);
    expect(tree.root?.rightChild?.rightChild?.leftChild?.rightChild).toBe(
      node14
    );
    expect(node14.color).toBe(Color.Red);
    expect(tree.root?.rightMost).toBe(node16);
    expect(node16.color).toBe(Color.Black);
    expect(node1.rightSubTreeSize).toBe(2);
    expect(node3.leftSubTreeSize).toBe(3);
    expect(node3.rightSubTreeSize).toBe(9);
    expect(node6.leftSubTreeSize).toBe(15);
    expect(node13.rightSubTreeSize).toBe(14);
    expect(node15.leftSubTreeSize).toBe(27);
    expect(node15.rightSubTreeSize).toBe(16);
    expect(node8.leftSubTreeSize).toBe(7);
    expect(node8.rightSubTreeSize).toBe(9);
    expect(node10.leftSubTreeSize).toBe(24);
    expect(node10.rightSubTreeSize).toBe(11);
    expect(node12.leftSubTreeSize).toBe(45);
    expect(node12.rightSubTreeSize).toBe(58);
    expect(node6.rightSubTreeSize).toBe(115);
  });
});

describe("method: delete", () => {
  test("delete root", () => {
    const node = new TreeNode();
    tree.insert(node);
    tree.delete(node);
    expect(tree.root).toBe(undefined);
  });

  test("delete all nodes in a three-node tree 1", () => {
    const node1 = new TreeNode({ value: 1, size: 1 });
    const node2 = new TreeNode({ value: 2, size: 2 });
    const node3 = new TreeNode({ value: 3, size: 3 });
    tree.insert(node3);
    tree.insert(node2, node3, true);
    tree.insert(node1, node2, true);
    tree.delete(node1);
    expect(tree.root).toBe(node2);
    expect(tree.root?.rightChild).toBe(node3);
    expect(node3.color).toBe(Color.Red);
    expect(node2.leftSubTreeSize).toBe(0);
    expect(node2.rightSubTreeSize).toBe(3);
    tree.delete(node2);
    expect(tree.root).toBe(node3);
    expect(node3.leftSubTreeSize).toBe(0);
    expect(node3.rightSubTreeSize).toBe(0);
    tree.delete(node3);
    expect(tree.root).toBe(undefined);
  });

  test("delete all nodes in a three-node tree 2", () => {
    const node1 = new TreeNode({ value: 1, size: 1 });
    const node2 = new TreeNode({ value: 2, size: 2 });
    const node3 = new TreeNode({ value: 3, size: 3 });
    tree.insert(node3);
    tree.insert(node2, node3, true);
    tree.insert(node1, node2, true);
    tree.delete(node2);
    expect(tree.root).toBe(node1);
    expect(tree.root?.rightChild).toBe(node3);
    expect(node3.color).toBe(Color.Red);
    expect(node1.leftSubTreeSize).toBe(0);
    expect(node1.rightSubTreeSize).toBe(3);
    tree.delete(node1);
    expect(tree.root).toBe(node3);
    tree.delete(node3);
    expect(tree.root).toBe(undefined);
  });

  test("delete three nodes in a eight-node tree", () => {
    const node1 = new TreeNode({ value: 1, size: 1 });
    const node2 = new TreeNode({ value: 2, size: 2 });
    const node3 = new TreeNode({ value: 3, size: 3 });
    const node4 = new TreeNode({ value: 4, size: 4 });
    const node5 = new TreeNode({ value: 5, size: 5 });
    const node6 = new TreeNode({ value: 6, size: 6 });
    const node7 = new TreeNode({ value: 7, size: 7 });
    const node8 = new TreeNode({ value: 8, size: 8 });
    tree.insert(node1);
    tree.insert(node2, node1);
    tree.insert(node3, node2);
    tree.insert(node4, node3);
    tree.insert(node5, node4);
    tree.insert(node6, node5);
    tree.insert(node7, node6);
    tree.insert(node8, node7);
    tree.delete(node1);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root).toBe(node4);
    expect(tree.root?.leftChild).toBe(node2);
    expect(node2.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.rightChild).toBe(node3);
    expect(node3.color).toBe(Color.Red);
    expect(tree.root?.rightChild).toBe(node6);
    expect(node6.color).toBe(Color.Red);
    expect(node2.leftSubTreeSize).toBe(0);
    expect(node4.leftSubTreeSize).toBe(5);
    tree.delete(node5);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root).toBe(node4);
    expect(tree.root?.rightChild).toBe(node7);
    expect(node7.color).toBe(Color.Red);
    expect(tree.root?.rightChild?.leftChild).toBe(node6);
    expect(node6.color).toBe(Color.Black);
    expect(tree.root?.rightChild?.rightChild).toBe(node8);
    expect(node8.color).toBe(Color.Black);
    expect(node6.leftSubTreeSize).toBe(0);
    expect(node6.rightSubTreeSize).toBe(0);
    expect(node7.leftSubTreeSize).toBe(6);
    expect(node7.rightSubTreeSize).toBe(8);
    expect(node4.rightSubTreeSize).toBe(21);
    tree.delete(node4);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root).toBe(node3);
    expect(tree.root?.leftChild).toBe(node2);
    expect(tree.root?.rightChild).toBe(node7);
    expect(node7.color).toBe(Color.Red);
    expect(node2.rightSubTreeSize).toBe(0);
    expect(node3.leftSubTreeSize).toBe(2);
    expect(node3.rightSubTreeSize).toBe(21);
  });

  test("delete nodes in a eight-node tree in random 1", () => {
    const node1 = new TreeNode({ value: 1, size: 1 });
    const node2 = new TreeNode({ value: 2, size: 2 });
    const node3 = new TreeNode({ value: 3, size: 3 });
    const node4 = new TreeNode({ value: 4, size: 4 });
    const node5 = new TreeNode({ value: 5, size: 5 });
    const node6 = new TreeNode({ value: 6, size: 6 });
    const node7 = new TreeNode({ value: 7, size: 7 });
    const node8 = new TreeNode({ value: 8, size: 8 });
    tree.insert(node1);
    tree.insert(node2, node1);
    tree.insert(node3, node2);
    tree.insert(node4, node3);
    tree.insert(node5, node4);
    tree.insert(node6, node5);
    tree.insert(node7, node6);
    tree.insert(node8, node7);
    tree.delete(node4);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root).toBe(node3);
    expect(tree.root?.leftChild).toBe(node2);
    expect(node2.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.leftChild).toBe(node1);
    expect(node1.color).toBe(Color.Red);
    expect(tree.root?.rightChild).toBe(node6);
    expect(tree.root?.rightChild?.leftChild).toBe(node5);
    expect(tree.root?.rightChild?.rightChild).toBe(node7);
    expect(tree.root?.rightChild?.rightChild?.rightChild).toBe(node8);
    expect(node3.leftSubTreeSize).toBe(3);
    expect(node3.rightSubTreeSize).toBe(26);
    expect(node2.leftSubTreeSize).toBe(1);
    expect(node2.rightSubTreeSize).toBe(0);
    tree.delete(node7);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root?.rightChild).toBe(node6);
    expect(node6.color).toBe(Color.Red);
    expect(tree.root?.rightChild?.rightChild).toBe(node8);
    expect(node8.color).toBe(Color.Black);
    expect(node3.rightSubTreeSize).toBe(19);
    expect(node6.rightSubTreeSize).toBe(8);
    tree.delete(node6);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root?.rightChild).toBe(node5);
    expect(node5.color).toBe(Color.Black);
    expect(tree.root?.rightChild?.rightChild).toBe(node8);
    expect(node8.color).toBe(Color.Red);
    expect(node3.rightSubTreeSize).toBe(13);
    expect(node5.rightSubTreeSize).toBe(8);
    tree.delete(node3);
    expect(tree.root).toBe(node2);
    expect(node2.color).toBe(Color.Black);
    expect(node2.leftSubTreeSize).toBe(1);
    expect(node2.rightSubTreeSize).toBe(13);
    tree.delete(node1);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root).toBe(node5);
    expect(tree.root?.leftChild).toBe(node2);
    expect(tree.root?.rightChild).toBe(node8);
    expect(node2.color).toBe(Color.Black);
    expect(node8.color).toBe(Color.Black);
    expect(node5.leftSubTreeSize).toBe(2);
    expect(node5.rightSubTreeSize).toBe(8);
    tree.delete(node5);
    expect(tree.root).toBe(node2);
    expect(node2.color).toBe(Color.Black);
    expect(tree.root?.rightChild).toBe(node8);
    expect(node8.color).toBe(Color.Red);
    expect(node2.leftSubTreeSize).toBe(0);
    expect(node2.rightSubTreeSize).toBe(8);
    tree.delete(node2);
    expect(tree.root).toBe(node8);
    expect(node8.color).toBe(Color.Black);
    tree.delete(node8);
    expect(tree.root).toBe(undefined);
  });

  test("delete nodes in a eight-node tree in random 2", () => {
    const node1 = new TreeNode({ value: 1, size: 1 });
    const node2 = new TreeNode({ value: 2, size: 2 });
    const node3 = new TreeNode({ value: 3, size: 3 });
    const node4 = new TreeNode({ value: 4, size: 4 });
    const node5 = new TreeNode({ value: 5, size: 5 });
    const node6 = new TreeNode({ value: 6, size: 6 });
    const node7 = new TreeNode({ value: 7, size: 7 });
    const node8 = new TreeNode({ value: 8, size: 8 });
    tree.insert(node8);
    tree.insert(node7, node8, true);
    tree.insert(node6, node7, true);
    tree.insert(node5, node6, true);
    tree.insert(node4, node5, true);
    tree.insert(node3, node4, true);
    tree.insert(node2, node3, true);
    tree.insert(node1, node2, true);
    tree.delete(node8);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root).toBe(node5);
    expect(tree.root?.leftChild).toBe(node3);
    expect(node3.color).toBe(Color.Red);
    expect(tree.root?.rightChild).toBe(node7);
    expect(node7.color).toBe(Color.Black);
    expect(node5.rightSubTreeSize).toBe(13);
    expect(node7.rightSubTreeSize).toBe(0);
    tree.delete(node7);
    expect(tree.root?.rightChild).toBe(node6);
    expect(node6.color).toBe(Color.Black);
    expect(node5.rightSubTreeSize).toBe(6);
    expect(node6.leftSubTreeSize).toBe(0);
    expect(node6.rightSubTreeSize).toBe(0);
    tree.delete(node6);
    expect(tree.root).toBe(node3);
    expect(tree.root?.leftChild).toBe(node2);
    expect(node2.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.leftChild).toBe(node1);
    expect(node1.color).toBe(Color.Red);
    expect(tree.root?.rightChild).toBe(node5);
    expect(node5.color).toBe(Color.Black);
    expect(tree.root?.rightChild?.leftChild).toBe(node4);
    expect(node4.color).toBe(Color.Red);
    expect(node3.leftSubTreeSize).toBe(3);
    expect(node3.rightSubTreeSize).toBe(9);
    expect(node5.leftSubTreeSize).toBe(4);
    expect(node5.rightSubTreeSize).toBe(0);
    tree.delete(node5);
    expect(tree.root?.rightChild).toBe(node4);
    expect(node4.color).toBe(Color.Black);
    expect(node3.rightSubTreeSize).toBe(4);
    tree.delete(node4);
    expect(tree.root).toBe(node2);
    expect(tree.root?.leftChild).toBe(node1);
    expect(node1.color).toBe(Color.Black);
    expect(tree.root?.rightChild).toBe(node3);
    expect(node3.color).toBe(Color.Black);
    expect(node2.leftSubTreeSize).toBe(1);
    expect(node2.rightSubTreeSize).toBe(3);
    expect(node3.leftSubTreeSize).toBe(0);
    expect(node3.rightSubTreeSize).toBe(0);
  });

  test("delete nodes in a sixteen-node tree in random 1", () => {
    const node1 = new TreeNode({ value: 1, size: 1 });
    const node2 = new TreeNode({ value: 2, size: 2 });
    const node3 = new TreeNode({ value: 3, size: 3 });
    const node4 = new TreeNode({ value: 4, size: 4 });
    const node5 = new TreeNode({ value: 5, size: 5 });
    const node6 = new TreeNode({ value: 6, size: 6 });
    const node7 = new TreeNode({ value: 7, size: 7 });
    const node8 = new TreeNode({ value: 8, size: 8 });
    const node9 = new TreeNode({ value: 9, size: 9 });
    const node10 = new TreeNode({ value: 10, size: 10 });
    const node11 = new TreeNode({ value: 11, size: 11 });
    const node12 = new TreeNode({ value: 12, size: 12 });
    const node13 = new TreeNode({ value: 13, size: 13 });
    const node14 = new TreeNode({ value: 14, size: 14 });
    const node15 = new TreeNode({ value: 15, size: 15 });
    const node16 = new TreeNode({ value: 16, size: 16 });
    tree.insert(node1);
    tree.insert(node2, node1);
    tree.insert(node3, node2);
    tree.insert(node4, node3);
    tree.insert(node5, node4);
    tree.insert(node6, node5);
    tree.insert(node7, node6);
    tree.insert(node8, node7);
    tree.insert(node9, node8);
    tree.insert(node10, node9);
    tree.insert(node11, node10);
    tree.insert(node12, node11);
    tree.insert(node13, node12);
    tree.insert(node14, node13);
    tree.insert(node15, node14);
    tree.insert(node16, node15);
    tree.delete(node8);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root?.rightChild).toBe(node12);
    expect(node12.color).toBe(Color.Red);
    expect(tree.root?.rightChild?.leftChild).toBe(node7);
    expect(node7.color).toBe(Color.Black);
    expect(tree.root?.rightChild?.leftChild?.leftChild).toBe(node6);
    expect(node6.color).toBe(Color.Black);
    expect(tree.root?.rightChild?.leftChild?.leftChild?.leftChild).toBe(node5);
    expect(node5.color).toBe(Color.Red);
    expect(tree.root?.rightChild?.leftChild?.rightChild).toBe(node10);
    expect(node10.color).toBe(Color.Red);
    expect(tree.root?.rightChild?.leftChild?.rightChild?.leftChild).toBe(node9);
    expect(node9.color).toBe(Color.Black);
    expect(tree.root?.rightChild?.leftChild?.rightChild?.rightChild).toBe(
      node11
    );
    expect(node11.color).toBe(Color.Black);
    expect(tree.root?.rightChild?.rightChild).toBe(node14);
    expect(node14.color).toBe(Color.Black);

    tree.delete(node4);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root).toBe(node12);
    expect(tree.root?.leftChild).toBe(node7);
    expect(node7.color).toBe(Color.Red);
    expect(tree.root?.leftChild?.leftChild).toBe(node3);
    expect(node3.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.leftChild?.leftChild).toBe(node2);
    expect(node2.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.leftChild?.leftChild?.leftChild).toBe(node1);
    expect(node1.color).toBe(Color.Red);
    expect(tree.root?.leftChild?.leftChild?.rightChild).toBe(node6);
    expect(node6.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.leftChild?.rightChild?.leftChild).toBe(node5);
    expect(node5.color).toBe(Color.Red);
    expect(tree.root?.leftChild?.rightChild).toBe(node10);
    expect(node10.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.rightChild?.leftChild).toBe(node9);
    expect(node9.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.rightChild?.rightChild).toBe(node11);
    expect(node11.color).toBe(Color.Black);
    expect(tree.root?.rightChild).toBe(node14);
    expect(node14.color).toBe(Color.Black);

    tree.delete(node11);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root?.leftChild).toBe(node7);
    expect(node7.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.leftChild).toBe(node3);
    expect(node3.color).toBe(Color.Red);
    expect(tree.root?.leftChild?.leftChild?.leftChild).toBe(node2);
    expect(node2.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.leftChild?.leftChild?.leftChild).toBe(node1);
    expect(node1.color).toBe(Color.Red);
    expect(tree.root?.leftChild?.leftChild?.rightChild?.leftChild).toBe(node5);
    expect(node5.color).toBe(Color.Red);
    expect(tree.root?.leftChild?.rightChild).toBe(node10);
    expect(node10.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.rightChild?.leftChild).toBe(node9);
    expect(node9.color).toBe(Color.Red);

    tree.delete(node1);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root?.leftChild?.leftChild?.leftChild).toBe(node2);
    expect(node2.color).toBe(Color.Black);

    tree.delete(node13);
    expect(tree.root?.rightChild).toBe(node15);
    expect(node15.color).toBe(Color.Black);
    expect(tree.root?.rightChild?.leftChild).toBe(node14);
    expect(node14.color).toBe(Color.Black);
    expect(tree.root?.rightChild?.rightChild).toBe(node16);
    expect(node16.color).toBe(Color.Black);

    tree.delete(node3);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root).toBe(node12);
    expect(tree.root?.leftChild).toBe(node7);
    expect(node7.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.leftChild).toBe(node5);
    expect(node5.color).toBe(Color.Red);
    expect(tree.root?.leftChild?.leftChild?.leftChild).toBe(node2);
    expect(node2.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.leftChild?.rightChild).toBe(node6);
    expect(node6.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.rightChild).toBe(node10);
    expect(node10.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.rightChild?.leftChild).toBe(node9);
    expect(node9.color).toBe(Color.Red);

    tree.delete(node6);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root?.leftChild?.leftChild).toBe(node5);
    expect(node5.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.leftChild?.leftChild).toBe(node2);
    expect(node2.color).toBe(Color.Red);

    tree.delete(node9);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root?.leftChild?.rightChild).toBe(node10);
    expect(node10.color).toBe(Color.Black);

    tree.delete(node10);
    expect(tree.root?.leftChild).toBe(node5);
    expect(node5.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.leftChild).toBe(node2);
    expect(node2.color).toBe(Color.Black);
  });

  test("delete nodes in a sixteen-node tree in random 2", () => {
    const node1 = new TreeNode({ value: 1, size: 1 });
    const node2 = new TreeNode({ value: 2, size: 2 });
    const node3 = new TreeNode({ value: 3, size: 3 });
    const node4 = new TreeNode({ value: 4, size: 4 });
    const node5 = new TreeNode({ value: 5, size: 5 });
    const node6 = new TreeNode({ value: 6, size: 6 });
    const node7 = new TreeNode({ value: 7, size: 7 });
    const node8 = new TreeNode({ value: 8, size: 8 });
    const node9 = new TreeNode({ value: 9, size: 9 });
    const node10 = new TreeNode({ value: 10, size: 10 });
    const node11 = new TreeNode({ value: 11, size: 11 });
    const node12 = new TreeNode({ value: 12, size: 12 });
    const node13 = new TreeNode({ value: 13, size: 13 });
    const node14 = new TreeNode({ value: 14, size: 14 });
    const node15 = new TreeNode({ value: 15, size: 15 });
    const node16 = new TreeNode({ value: 16, size: 16 });
    tree.insert(node1);
    tree.insert(node2, node1);
    tree.insert(node3, node2);
    tree.insert(node4, node3);
    tree.insert(node5, node4);
    tree.insert(node6, node5);
    tree.insert(node7, node6);
    tree.insert(node8, node7);
    tree.insert(node9, node8);
    tree.insert(node10, node9);
    tree.insert(node11, node10);
    tree.insert(node12, node11);
    tree.insert(node13, node12);
    tree.insert(node14, node13);
    tree.insert(node15, node14);
    tree.insert(node16, node15);
    expect(isBalanced(tree.root)).toBe(true);
    tree.delete(node1);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root).toBe(node8);
    expect(tree.root?.leftChild).toBe(node4);
    expect(node4.color).toBe(Color.Black);
    expect(tree.root?.leftChild?.leftChild).toBe(node2);
    expect(node2.color).toBe(Color.Black);
    expect(tree.root?.leftChild.leftChild.rightChild).toBe(node3);
    expect(node3.color).toBe(Color.Red);
    expect(tree.root?.leftChild.rightChild).toBe(node6);
    expect(node6.color).toBe(Color.Red);
    expect(tree.root?.rightChild).toBe(node12);
    expect(node12.color).toBe(Color.Black);
    expect(tree.root?.rightChild.leftChild).toBe(node10);
    expect(node10.color).toBe(Color.Red);
    expect(node8.leftSubTreeSize).toBe(27);
    expect(node8.rightSubTreeSize).toBe(100);
    expect(node4.leftSubTreeSize).toBe(5);
    expect(node2.leftSubTreeSize).toBe(0);
    tree.delete(node9);
    expect(isBalanced(tree.root)).toBe(true);
    expect(node8.rightSubTreeSize).toBe(91);
    expect(node12.leftSubTreeSize).toBe(21);
    expect(node10.leftSubTreeSize).toBe(0);
    expect(node10.rightSubTreeSize).toBe(11);
    tree.delete(node10);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root?.rightChild.leftChild).toBe(node11);
    expect(node11.color).toBe(Color.Black);
    expect(node8.rightSubTreeSize).toBe(81);
    expect(node12.leftSubTreeSize).toBe(11);
    tree.delete(node11);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root?.rightChild).toBe(node14);
    expect(node14.color).toBe(Color.Black);
    expect(tree.root?.rightChild.leftChild).toBe(node12);
    expect(node12.color).toBe(Color.Black);
    expect(tree.root?.rightChild.leftChild.rightChild).toBe(node13);
    expect(node13.color).toBe(Color.Red);
    expect(tree.root?.rightChild.rightChild).toBe(node15);
    expect(node15.color).toBe(Color.Black);
    expect(tree.root?.rightChild.rightChild.rightChild).toBe(node16);
    expect(node16.color).toBe(Color.Red);
    expect(tree.root?.leftChild).toBe(node4);
    expect(node4.color).toBe(Color.Black);
    expect(node8.rightSubTreeSize).toBe(70);
    expect(node14.leftSubTreeSize).toBe(25);
    expect(node14.rightSubTreeSize).toBe(31);
    expect(node15.leftSubTreeSize).toBe(0);
    tree.delete(node12);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root?.rightChild.leftChild).toBe(node13);
    expect(node13.color).toBe(Color.Black);
    expect(node8.rightSubTreeSize).toBe(58);
    expect(node14.leftSubTreeSize).toBe(13);
    tree.delete(node13);
    expect(tree.root?.rightChild).toBe(node15);
    expect(node15.color).toBe(Color.Black);
    expect(tree.root?.rightChild.leftChild).toBe(node14);
    expect(node14.color).toBe(Color.Black);
    expect(node8.rightSubTreeSize).toBe(45);
    expect(node15.leftSubTreeSize).toBe(14);
    expect(node15.rightSubTreeSize).toBe(16);
    tree.delete(node15);
    expect(isBalanced(tree.root)).toBe(true);
    expect(tree.root).toBe(node6);
    expect(tree.root?.leftChild).toBe(node4);
    expect(tree.root?.rightChild).toBe(node8);
    expect(node8.color).toBe(Color.Black);
    expect(tree.root?.rightChild.leftChild).toBe(node7);
    expect(node7.color).toBe(Color.Black);
    expect(tree.root?.rightChild.rightChild).toBe(node14);
    expect(tree.root?.rightChild.rightChild.rightChild).toBe(node16);
    expect(node16.color).toBe(Color.Red);
    expect(node6.leftSubTreeSize).toBe(14);
    expect(node6.rightSubTreeSize).toBe(45);
    expect(node8.leftSubTreeSize).toBe(7);
    expect(node8.rightSubTreeSize).toBe(30);
    expect(node14.leftSubTreeSize).toBe(0);
    expect(node14.rightSubTreeSize).toBe(16);
  });
});

describe("method: find", () => {
  test("no result when the tree is empty", () => {
    expect(() => {
      tree.find(0);
    }).toThrowError();
  });

  test("return target when it hit", () => {
    const node1 = new TreeNode({ value: 1, size: 1 });
    const node2 = new TreeNode({ value: 2, size: 2 });
    const node3 = new TreeNode({ value: 3, size: 3 });
    const node4 = new TreeNode({ value: 4, size: 4 });
    const node5 = new TreeNode({ value: 5, size: 5 });
    const node6 = new TreeNode({ value: 6, size: 6 });
    const node7 = new TreeNode({ value: 7, size: 7 });
    const node8 = new TreeNode({ value: 8, size: 8 });
    const node9 = new TreeNode({ value: 9, size: 9 });
    const node10 = new TreeNode({ value: 10, size: 10 });
    const node11 = new TreeNode({ value: 11, size: 11 });
    const node12 = new TreeNode({ value: 12, size: 12 });
    const node13 = new TreeNode({ value: 13, size: 13 });
    const node14 = new TreeNode({ value: 14, size: 14 });
    const node15 = new TreeNode({ value: 15, size: 15 });
    const node16 = new TreeNode({ value: 16, size: 16 });
    tree.insert(node1);
    tree.insert(node2, node1);
    tree.insert(node3, node2);
    tree.insert(node4, node3);
    tree.insert(node5, node4);
    tree.insert(node6, node5);
    tree.insert(node7, node6);
    tree.insert(node8, node7);
    tree.insert(node9, node8);
    tree.insert(node10, node9);
    tree.insert(node11, node10);
    tree.insert(node12, node11);
    tree.insert(node13, node12);
    tree.insert(node14, node13);
    tree.insert(node15, node14);
    tree.insert(node16, node15);
    expect(tree.find(0)?.target).toBe(node1);
    expect(tree.find(1)?.target).toBe(node2);
    expect(tree.find(2)?.target).toBe(node2);
    expect(tree.find(6)?.target).toBe(node4);
    expect(tree.find(9)?.target).toBe(node4);
    expect(tree.find(135)?.target).toBe(node16);
  });
});

describe("method: findNodes", () => {
  test("return target nodes", () => {
    const node1 = new TreeNode({ value: 1, size: 1 });
    const node2 = new TreeNode({ value: 2, size: 2 });
    const node3 = new TreeNode({ value: 3, size: 3 });
    const node4 = new TreeNode({ value: 4, size: 4 });
    const node5 = new TreeNode({ value: 5, size: 5 });
    const node6 = new TreeNode({ value: 6, size: 6 });
    const node7 = new TreeNode({ value: 7, size: 7 });
    const node8 = new TreeNode({ value: 8, size: 8 });
    const node9 = new TreeNode({ value: 9, size: 9 });
    const node10 = new TreeNode({ value: 10, size: 10 });
    const node11 = new TreeNode({ value: 11, size: 11 });
    const node12 = new TreeNode({ value: 12, size: 12 });
    const node13 = new TreeNode({ value: 13, size: 13 });
    const node14 = new TreeNode({ value: 14, size: 14 });
    const node15 = new TreeNode({ value: 15, size: 15 });
    const node16 = new TreeNode({ value: 16, size: 16 });
    tree.insert(node1);
    tree.insert(node2, node1);
    tree.insert(node3, node2);
    tree.insert(node4, node3);
    tree.insert(node5, node4);
    tree.insert(node6, node5);
    tree.insert(node7, node6);
    tree.insert(node8, node7);
    tree.insert(node9, node8);
    tree.insert(node10, node9);
    tree.insert(node11, node10);
    tree.insert(node12, node11);
    tree.insert(node13, node12);
    tree.insert(node14, node13);
    tree.insert(node15, node14);
    tree.insert(node16, node15);
    expect(tree.findNodes(new Range(45, 10))).toEqual({
      nodes: [node10],
      startPos: 0,
      endPos: 9,
    });
    expect(tree.findNodes(new Range(11, 3))).toEqual({
      nodes: [node5],
      startPos: 1,
      endPos: 3,
    });
    expect(tree.findNodes(new Range(45, 30))).toEqual({
      nodes: [node10, node11, node12],
      startPos: 0,
      endPos: 8,
    });
    expect(tree.findNodes(new Range(5, 20))).toEqual({
      nodes: [node3, node4, node5, node6, node7],
      startPos: 2,
      endPos: 3,
    });
    expect(tree.findNodes(new Range(110))).toEqual({
      nodes: [node15, node16],
      startPos: 5,
      endPos: 15,
    });
  });
});
