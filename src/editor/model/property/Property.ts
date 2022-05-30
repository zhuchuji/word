export interface Property {
  isSame(property: Property): boolean;
  clone(): Property;
}

export class PropertyBase {

}
