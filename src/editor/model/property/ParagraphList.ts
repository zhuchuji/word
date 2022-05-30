import { InsertOptions, ModifyOptions, DeleteOptions, PropertyList, PropertyListBase } from './PropertyList';
import { ParagraphProperty } from './ParagraphProperty';
import { Range } from '../base/Range';
import { Iterator } from './Iterator';
import { PlaceholderChar } from '../base/Placeholder';
import { PropertyNode } from './PropertyNode';

export class ParagraphList extends PropertyListBase<ParagraphProperty> implements PropertyList<ParagraphProperty> {
  constructor() {
    super();
  }

  public createIterator(limit?: Range): Iterator<ParagraphProperty> {
    return new Iterator<ParagraphProperty>(this.tree, limit);
  }

  public onInsert({ range, text, property }: InsertOptions<ParagraphProperty>): void {
    const { target, offset } = this.tree.find(range.start);
    if (range.length === 1 && text === PlaceholderChar.ParagraphReturn) {
      const truncatedPos = offset + 1;
      const newNode = new PropertyNode<ParagraphProperty>({
        size: target.size - truncatedPos,
        property,
      });
      target.size = truncatedPos;
      this.tree.fixOnPath(target);
      this.tree.insert(newNode, target);
    } else {
      this.insert(target, range.length);
    }
  }

  public onModify({ range, property }: ModifyOptions<ParagraphProperty>): void {
    const { target, offset } = this.tree.find(range.start);
    
  }

  public onDelete({ range }: DeleteOptions): void {
    super.delete(range);
  }
}
