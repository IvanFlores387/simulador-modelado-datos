export type ValidationIssueType = 'entity' | 'attribute' | 'relation' | 'general';

export interface ValidationIssueModel {
  code: string;
  message: string;
  type?: ValidationIssueType;
}

export interface ValidationResultModel {
  isValid: boolean;
  integrityScore: number;
  issues: ValidationIssueModel[];
}
