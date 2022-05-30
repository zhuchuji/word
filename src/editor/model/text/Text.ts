/**
 * Text model with piece table implementation: high speed operation for read/insert/delete at log(n) complexity
 */

import { ICharacterBuffer } from "./ICharacterBuffer";
import { CharacterBuffer } from "./CharacterBuffer";
import { Range } from "../base/Range";
import { IBalancedTree } from "../base/IBalancedTree";
import BalanceTree, {
  BalanceNode,
  BalanceNodeOptions,
} from "../base/BalanceTree";
import { IText } from "./IText";

interface PieceOptions extends BalanceNodeOptions {
  bufferStart: number;
}
export class Piece extends BalanceNode {
  public bufferStart: number;

  constructor({ bufferStart, ...options }: PieceOptions = { bufferStart: 0 }) {
    super(options);
    this.bufferStart = bufferStart;
  }

  public get bufferEnd() {
    return this.bufferStart + this.size - 1;
  }
}

/**
 * Working as String for text content read/insert/delete
 */
export default class Text implements IText {
  private buffer: ICharacterBuffer;
  private tree: IBalancedTree<Piece>;

  constructor(originalString?: string) {
    this.buffer = new CharacterBuffer(originalString);
    this.tree = new BalanceTree();
    if (originalString) {
      const piece = new Piece({
        bufferStart: 0,
        size: originalString.length,
      });
      this.tree.insert(piece);
    }
  }

  public getText(range: Range) {
    const { nodes, startPos, endPos } = this.tree.findNodes(range);
    return nodes
      .map((node, index) => {
        let bufferStart = node.bufferStart;
        let length = node.size;
        if (index === 0) {
          bufferStart = bufferStart + startPos;
          length = length - startPos;
        }
        if (index === nodes.length - 1) {
          if (index === 0) {
            length = endPos - startPos + 1;
          } else {
            length = endPos + 1;
          }
        }
        return this.buffer.getText(new Range(bufferStart, length));
      })
      .join("");
  }

  public insert(pos: number, content: string, beforeOrAfter: boolean = false) {
    const lastBufferEnd = this.buffer.nextPos - 1;
    const bufferIndex = this.buffer.append(content);
    const newPiece = new Piece({
      bufferStart: bufferIndex.start,
      size: bufferIndex.length,
    });
    if (!this.tree.root) {
      this.tree.insert(newPiece);
    } else {
      const result = this.tree.find(pos);
      const { target, offset } = result;
      // there are three cases: insert at the beginning, middle and the end.
      if (offset === 0 && beforeOrAfter) {
        this.tree.insert(newPiece, target, true);
      } else if (offset === target.size - 1 && !beforeOrAfter) {
        if (target.bufferEnd === lastBufferEnd) {
          target.size += bufferIndex.length;
          this.tree.fixOnPath(target);
        } else {
          this.tree.insert(newPiece, target);
        }
      } else {
        // break the target into two pieces and insert content after the first one
        const truncatedPos = beforeOrAfter ? offset - 1 : offset;
        const leftSize = target.size - (truncatedPos + 1);
        target.size = target.size - leftSize;
        const truncatedPiece = new Piece({
          bufferStart: target.bufferEnd + 1,
          size: leftSize,
        });
        this.tree.insert(truncatedPiece, target);
        const newPiece = new Piece({
          bufferStart: bufferIndex.start,
          size: bufferIndex.length,
        });
        this.tree.insert(newPiece, target);
      }
    }
  }

  public delete(range: Range) {
    const { nodes, startPos, endPos } = this.tree.findNodes(range);

    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      const start = i === 0 ? startPos : 0;
      let end = i === nodes.length - 1 ? endPos : node.size - 1;
      if (start === 0 && end === node.size - 1) {
        this.tree.delete(node);
      } else if (start > 0 && end < node.size - 1) {
        const leftSize = node.size - 1 - end;
        node.size = start;
        this.tree.fixOnPath(node);
        const newPiece = new Piece({
          bufferStart: node.bufferStart + end + 1,
          size: leftSize,
        });
        this.tree.insert(newPiece, node);
      } else {
        const deletedLength = end - start + 1;
        node.bufferStart =
          start === 0 ? node.bufferStart + deletedLength : node.bufferStart;
        node.size = node.size - deletedLength;
        this.tree.fixOnPath(node);
      }
    }
  }
}
