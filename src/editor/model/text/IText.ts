import { Range } from "../base/Range";

export interface IText {
  /**
   * Read text
   * @param range
   */
  getText(range: Range): string;

  /**
   * Insert text
   * @param pos Starts from 0
   * @param content
   * @param beforeOrAfter true: before the current position, false: after the current position
   */
  insert(pos: number, content: string, beforeOrAfter: boolean): void;

  /**
   * Delete text
   * @param range
   */
  delete(range: Range): void;
}
