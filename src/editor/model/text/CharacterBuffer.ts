import { ICharacterBuffer } from "./ICharacterBuffer";
import { Range } from "../base/Range";

export type Page = Uint16Array;

/**
 * Append-only buffer to store characters, high-performance for read and add.
 */
export class CharacterBuffer implements ICharacterBuffer {
  /** unit: bibyte */
  private static PAGE_SIZE = 1024;

  private originalString: string;
  private pages: Page[] = [];
  /** next position for appending */
  private next = 0;

  constructor(originalString: string = "") {
    this.originalString = originalString;
    this.createNewPage();
  }

  public get length() {
    return this.originalString.length + this.pos;
  }

  public get nextPos() {
    return this.pos;
  }

  public charCodeAt(index: number) {
    if (this.checkInBuffer(index, 1)) {
      if (index < this.originalString.length) {
        return this.originalString.charCodeAt(index);
      }
      const bufferIndex = index - this.originalString.length;
      const pageIndex = Math.trunc(bufferIndex / CharacterBuffer.PAGE_SIZE);
      let innerIndex = bufferIndex % CharacterBuffer.PAGE_SIZE;
      return this.pages[pageIndex][innerIndex];
    } else {
      throw new Error(`Invalid Parameters: index=${index} is not in buffer`);
    }
  }

  public getText(range: Range) {
    if (this.checkInBuffer(range.start, range.length)) {
      let pageStartIndex = 0;
      let leftLength = range.length;
      let text = "";
      if (this.originalString.length > range.start) {
        const textLength =
          range.length > this.originalString.length - range.start
            ? this.originalString.length - range.start
            : range.length;
        text = this.originalString.substr(range.start, textLength);
        leftLength = leftLength - text.length;
      } else {
        pageStartIndex = range.start - this.originalString.length;
      }
      if (leftLength > 0) {
        text += this.getTextFromPages(pageStartIndex, leftLength);
      }
      return text;
    } else {
      throw new Error(
        `Invalid Parameters: start=${range.start} and length=${range.length} is out of range`
      );
    }
  }

  private getTextFromPages(start: number, length: number) {
    const slice: Uint16Array = new Uint16Array(length);
    const startPageIndex = Math.trunc(start / CharacterBuffer.PAGE_SIZE);
    const endPageIndex = Math.trunc(
      (start + length - 1) / CharacterBuffer.PAGE_SIZE
    );
    const startIndex = start % CharacterBuffer.PAGE_SIZE;
    const endIndex = (start + length - 1) % CharacterBuffer.PAGE_SIZE;
    let sliceIndex = 0;
    for (
      let pageIndex = startPageIndex;
      pageIndex <= endPageIndex;
      pageIndex += 1
    ) {
      let startPos = 0;
      let endPos = CharacterBuffer.PAGE_SIZE - 1;
      if (pageIndex === startPageIndex) {
        startPos = startIndex;
      }
      if (pageIndex === endPageIndex) {
        endPos = endIndex;
      }
      for (let i = startPos; i <= endPos; i += 1) {
        slice[sliceIndex] = this.pages[pageIndex][i];
        sliceIndex += 1;
      }
    }
    return Array.from(slice)
      .map((charCode) => String.fromCharCode(charCode))
      .join("");
  }

  public append(content: string): Range {
    if (content.length > 0) {
      const canAppendAll = this.canAppendAll(content.length);
      if (canAppendAll) {
        const page = this.getAppendPage();
        const start = this.pos;
        this.appendCharacters(content, page);
        const end = this.pos;
        return new Range(this.originalString.length + start, end - start);
      } else {
        let index = 0;
        const start = this.pos;
        while (index < content.length) {
          const page = this.getAppendPage();
          const length = CharacterBuffer.PAGE_SIZE - this.next;
          const slice = content.substr(index, length);
          this.appendCharacters(slice, page);
          index += length;
        }
        const end = this.pos;
        return new Range(this.originalString.length + start, end - start);
      }
    } else {
      throw new Error(`Invalid Parameters: content ${content} is empty`);
    }
  }

  private checkInBuffer(start: number, length: number) {
    return start >= 0 && start + length <= this.length;
  }

  private appendCharacters(content: string, page: Page) {
    if (this.next + content.length <= CharacterBuffer.PAGE_SIZE) {
      for (let i = 0; i < content.length; i += 1) {
        const charCode = content.charCodeAt(i);
        page[this.next] = charCode;
        this.next += 1;
      }
      if (this.next >= CharacterBuffer.PAGE_SIZE) {
        this.createNewPage();
      }
    } else {
      throw new Error(
        `Invalid Parameters: next ${this.next}, content ${content} is over page size`
      );
    }
  }

  private canAppendAll(length: number) {
    return CharacterBuffer.PAGE_SIZE - this.next >= length;
  }

  private getAppendPage() {
    if (this.next >= CharacterBuffer.PAGE_SIZE) {
      return this.createNewPage();
    }
    return this.pages[this.pages.length - 1];
  }

  private createNewPage() {
    const page = new Uint16Array(CharacterBuffer.PAGE_SIZE);
    this.pages.push(page);
    this.next = 0;
    return page;
  }

  private get pos() {
    return (this.pages.length - 1) * CharacterBuffer.PAGE_SIZE + this.next;
  }
}
