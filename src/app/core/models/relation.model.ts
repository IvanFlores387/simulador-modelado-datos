export type RelationCardinality = '1:1' | '1:N' | 'N:M';

export interface RelationModel {
  id: string;
  fromEntityId: string;
  toEntityId: string;
  name: string;
  cardinality: RelationCardinality;
}
