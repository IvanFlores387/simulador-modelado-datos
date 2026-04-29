import { Injectable, signal } from '@angular/core';
import { EntityNodeModel } from '../models/entity-node.model';
import { ExpectedEntityModel, ExpectedRelationModel } from '../models/level-config.model';
import { ValidationIssueModel, ValidationResultModel } from '../models/validation-result.model';
import { LevelConfigService } from './level-config.service';
import { SimulatorStateService } from './simulator-state.service';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  readonly lastResult = signal<ValidationResultModel | null>(null);

  constructor(
    private readonly levelConfigService: LevelConfigService,
    private readonly simulatorStateService: SimulatorStateService
  ) {}

  validateCurrentLevel(): ValidationResultModel {
    const level = this.levelConfigService.currentLevel();
    const nodes = this.simulatorStateService.nodes();
    const issues: ValidationIssueModel[] = [];

    for (const expectedEntity of level.expectedEntities) {
      const currentEntity = this.findEntity(nodes, expectedEntity);

      if (!currentEntity) {
        issues.push({
          code: `ENTITY_NOT_FOUND_${this.buildCode(expectedEntity.name)}`,
          type: 'entity',
          message: `No existe la entidad ${expectedEntity.name}. Puedes crearla con alguno de estos nombres: ${expectedEntity.acceptedNames.join(', ')}.`,
        });
        continue;
      }

      this.validateAttributes(currentEntity, expectedEntity, issues);
    }

    if (level.expectedRelations?.length) {
      this.validateRelations(level.expectedRelations, nodes, issues);
    }

    const totalRules = this.countTotalRules();
    const validRules = Math.max(totalRules - issues.length, 0);
    const integrityScore = totalRules === 0 ? 0 : Math.round((validRules / totalRules) * 100);

    const result: ValidationResultModel = {
      isValid: issues.length === 0,
      integrityScore,
      issues,
    };

    this.simulatorStateService.integrity.set(integrityScore);
    this.lastResult.set(result);
    return result;
  }

  validateLevelOne(): ValidationResultModel {
    return this.validateCurrentLevel();
  }

  clearResult(): void {
    this.lastResult.set(null);
  }

  private validateAttributes(
    currentEntity: EntityNodeModel,
    expectedEntity: ExpectedEntityModel,
    issues: ValidationIssueModel[]
  ): void {
    for (const expectedAttribute of expectedEntity.expectedAttributes) {
      const currentAttribute = currentEntity.attributes.find((attribute) =>
        expectedAttribute.acceptedNames.some(
          (acceptedName) => this.normalizeText(attribute.name) === this.normalizeText(acceptedName)
        )
      );

      if (!currentAttribute) {
        issues.push({
          code: `ATTRIBUTE_MISSING_${this.buildCode(expectedEntity.name)}_${this.buildCode(expectedAttribute.name)}`,
          type: 'attribute',
          message: `En ${expectedEntity.name} falta un atributo para representar ${expectedAttribute.name}. Puedes usar: ${expectedAttribute.acceptedNames.join(', ')}. ${expectedAttribute.learningPurpose}`,
        });
        continue;
      }

      if (currentAttribute.type !== expectedAttribute.type) {
        issues.push({
          code: `ATTRIBUTE_TYPE_INVALID_${this.buildCode(expectedEntity.name)}_${this.buildCode(expectedAttribute.name)}`,
          type: 'attribute',
          message: `En ${expectedEntity.name}, el atributo "${currentAttribute.name}" debe ser de tipo ${expectedAttribute.type}.`,
        });
      }

      if (expectedAttribute.isPrimaryKey && !currentAttribute.isPrimaryKey) {
        issues.push({
          code: `ATTRIBUTE_PK_INVALID_${this.buildCode(expectedEntity.name)}_${this.buildCode(expectedAttribute.name)}`,
          type: 'attribute',
          message: `En ${expectedEntity.name}, el atributo "${currentAttribute.name}" debe marcarse como llave primaria (PK).`,
        });
      }

      if (
        expectedAttribute.length &&
        currentAttribute.length &&
        currentAttribute.length < expectedAttribute.length
      ) {
        issues.push({
          code: `ATTRIBUTE_LENGTH_INVALID_${this.buildCode(expectedEntity.name)}_${this.buildCode(expectedAttribute.name)}`,
          type: 'attribute',
          message: `En ${expectedEntity.name}, el atributo "${currentAttribute.name}" debe tener longitud mínima de ${expectedAttribute.length}.`,
        });
      }
    }
  }

  private validateRelations(
    expectedRelations: ExpectedRelationModel[],
    nodes: EntityNodeModel[],
    issues: ValidationIssueModel[]
  ): void {
    const relations = this.simulatorStateService.relations();

    for (const expectedRelation of expectedRelations) {
      const relationExists = relations.some((relation) => {
        const fromEntityName = this.simulatorStateService.getEntityNameById(relation.fromEntityId);
        const toEntityName = this.simulatorStateService.getEntityNameById(relation.toEntityId);

        return (
          this.isSameEntityName(fromEntityName, expectedRelation.fromEntity, nodes) &&
          this.isSameEntityName(toEntityName, expectedRelation.toEntity, nodes) &&
          expectedRelation.acceptedNames.some(
            (acceptedName) => this.normalizeText(relation.name) === this.normalizeText(acceptedName)
          ) &&
          relation.cardinality === expectedRelation.cardinality
        );
      });

      if (!relationExists) {
        issues.push({
          code: `RELATION_MISSING_${this.buildCode(expectedRelation.fromEntity)}_${this.buildCode(expectedRelation.toEntity)}`,
          type: 'relation',
          message: `Falta la relación ${expectedRelation.fromEntity} ${expectedRelation.name} ${expectedRelation.toEntity} con cardinalidad ${expectedRelation.cardinality}. ${expectedRelation.learningPurpose}`,
        });
      }
    }
  }

  private findEntity(nodes: EntityNodeModel[], expectedEntity: ExpectedEntityModel): EntityNodeModel | null {
    return (
      nodes.find((node) =>
        expectedEntity.acceptedNames.some(
          (acceptedName) => this.normalizeText(node.name) === this.normalizeText(acceptedName)
        )
      ) ?? null
    );
  }

  private isSameEntityName(currentName: string, expectedName: string, nodes: EntityNodeModel[]): boolean {
    const expectedEntity = this.levelConfigService
      .currentLevel()
      .expectedEntities.find((entity) => entity.name === expectedName);

    if (!expectedEntity) {
      return this.normalizeText(currentName) === this.normalizeText(expectedName);
    }

    return expectedEntity.acceptedNames.some(
      (acceptedName) => this.normalizeText(currentName) === this.normalizeText(acceptedName)
    );
  }

  private countTotalRules(): number {
    const level = this.levelConfigService.currentLevel();
    const entityRules = level.expectedEntities.length;
    const attributeRules = level.expectedEntities.reduce(
      (total, entity) => total + entity.expectedAttributes.length,
      0
    );
    const relationRules = level.expectedRelations?.length ?? 0;

    return entityRules + attributeRules + relationRules;
  }

  private normalizeText(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');
  }

  private buildCode(value: string): string {
    return this.normalizeText(value).toUpperCase().replaceAll(' ', '_');
  }
}
