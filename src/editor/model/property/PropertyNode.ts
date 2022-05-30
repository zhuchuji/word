/**
 * PropertyNode is the interface between property tree and property.
 * It's used for accessing the property
 */

import { Range } from '../base/range';
import { BalanceNode, BalanceNodeOptions } from "../base/BalanceTree";
import { Property } from './Property';

interface Options<Property> extends BalanceNodeOptions {
  property: Property;   
}

 
export class PropertyNode<PropertyType extends Property> extends BalanceNode {
  public readonly property: PropertyType;

  constructor({ property, ...balancedNodeOptions }: Options<PropertyType>) {
    super(balancedNodeOptions);
    this.property = property;
  }

  public getRange() {
    return new Range(this.leftSubTreeSize, this.size);
  }

  public getProperty(): PropertyType {
    return this.property;
  }
}
 