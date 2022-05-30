import { Range } from "../base/Range";

export interface ICharacterBuffer {
  /**
   * The length of the buffer in total
   */
  length: number;

  /**
   * The position for inserting next character, starts from 0.
   */
  nextPos: number;

  /**
   * Get the char code from buffer
   * @param index index in buffer
   */
  charCodeAt(index: number): number;

  /**
   * Get the slice string from buffer
   * @param interval slice in buffer
   */
  getText(interval: Range): string;

  /**
   * Append content string to the end of the buffer
   * @param content the string to be appended;
   */
  append(content: string): Range;
}
