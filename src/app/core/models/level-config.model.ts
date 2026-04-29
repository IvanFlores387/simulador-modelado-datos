export type DataType = 'INT' | 'VARCHAR' | 'DATE' | 'BOOLEAN' | 'FLOAT';
export type RelationCardinality = '1:1' | '1:N' | 'N:M';

export interface ExpectedAttributeModel {
  name: string;
  acceptedNames: string[];
  type: DataType;
  isPrimaryKey: boolean;
  required: boolean;
  learningPurpose: string;
  length?: number | null;
}

export interface ExpectedEntityModel {
  name: string;
  acceptedNames: string[];
  expectedAttributes: ExpectedAttributeModel[];
  learningPurpose: string;
}

export interface ExpectedRelationModel {
  fromEntity: string;
  toEntity: string;
  name: string;
  acceptedNames: string[];
  cardinality: RelationCardinality;
  learningPurpose: string;
}

export interface LevelConfigModel {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  objective: string;
  narrativeText: string;
  expectedEntityName: string;
  expectedAttributes: ExpectedAttributeModel[];
  expectedEntities: ExpectedEntityModel[];
  expectedRelations?: ExpectedRelationModel[];
}
