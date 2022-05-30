import { Range } from '../base/Range';
import { Property, PropertyBase } from './Property';

export class SpanProperty extends PropertyBase implements Property {
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  color: string;
}
