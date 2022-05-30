export const Infinite = Number.POSITIVE_INFINITY;

/**
 * Range represent the position of a slice in the document
 */
export class Range {
  public start: number;
  public length: number;

  constructor(start: number, length: number = Infinite) {
    this.start = start;
    this.length = length;
  }

  public get end(): number {
    return this.start + this.length - 1;
  }

  public isEqual(range: Range): boolean {
    return this.start === range.start && this.length === range.length;
  }

  public isInfinite() {
    return this.length === Infinite;
  }

  public isIntersecting(range: Range) {
    return this.start <= range.end && this.end >= range.start;
  }

  public getIntersection(range: Range) {
    if (this.isIntersecting(range)) {
      const start = this.start > range.start ? this.start : range.start;
      const end = this.end < range.end ? this.end : range.end;
      return new Range(start, end - start + 1);
    }
  }

  public toString() {
    return `[${this.start}, ${this.end}]`;
  }
}
