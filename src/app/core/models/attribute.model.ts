export type DataType = 'INT' | 'VARCHAR' | 'DATE' | 'BOOLEAN' | 'FLOAT';

export interface AttributeModel {
  id: string;
  name: string;
  type: DataType;
  length: number | null;
  description: string;
  isPrimaryKey: boolean;
}
