import { Property, PropertyBase } from './Property';

export interface Options {
  fontSize: number;
  fontWeight: number;
  lineHeihgt: number;
  color: string;
}

export class ParagraphProperty extends PropertyBase implements Property {
  public fontSize: number;
  public fontWeight: number;
  public lineHeight: number;
  public color: string;

  constructor({
    fontSize,
    fontWeight,
    lineHeihgt,
    color,
  }: Options) {
    super();
    this.fontSize = fontSize;
    this.fontWeight = fontWeight;
    this.lineHeight = lineHeihgt;
    this.color = color;
  }

  public isSame(property: ParagraphProperty): boolean {
    return this.fontSize === property.fontSize &&
      this.fontWeight === property.fontWeight &&
      this.lineHeight === property.lineHeight &&
      this.color === property.color;
  }

  public clone(): ParagraphProperty {
    return new ParagraphProperty({
      fontSize: this.fontSize,
      fontWeight: this.fontWeight,
      lineHeihgt: this.lineHeight,
      color: this.color,
    });
  }
}
