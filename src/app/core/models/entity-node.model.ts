import { AttributeModel } from './attribute.model';

export interface EntityNodeModel {
  id: string;
  name: string;
  x: number;
  y: number;
  attributes: AttributeModel[];
  selected: boolean;
}
