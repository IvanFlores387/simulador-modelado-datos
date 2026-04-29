import { Injectable, computed, signal } from '@angular/core';
import { AttributeModel } from '../models/attribute.model';
import { EntityNodeModel } from '../models/entity-node.model';
import { RelationModel } from '../models/relation.model';

@Injectable({
  providedIn: 'root',
})
export class SimulatorStateService {
  readonly integrity = signal<number>(0);
  readonly nodes = signal<EntityNodeModel[]>([]);
  readonly relations = signal<RelationModel[]>([]);
  readonly selectedNodeId = signal<string | null>(null);

  readonly selectedNode = computed(() =>
    this.nodes().find((node) => node.id === this.selectedNodeId()) ?? null
  );

  createEntity(name: string): void {
    const cleanName = name.trim().toUpperCase();

    if (!cleanName) return;

    const alreadyExists = this.nodes().some(
      (node) => node.name.trim().toUpperCase() === cleanName
    );

    if (alreadyExists) {
      this.selectExistingNode(cleanName);
      return;
    }

    const newNode: EntityNodeModel = {
      id: crypto.randomUUID(),
      name: cleanName,
      x: 120,
      y: 120,
      attributes: [],
      selected: false,
    };

    this.nodes.update((nodes) => [...nodes, newNode]);
    this.selectNode(newNode.id);
    this.recalculateIntegrity();
  }

  private selectExistingNode(entityName: string): void {
    const existingNode = this.nodes().find(
      (node) => node.name.trim().toUpperCase() === entityName
    );

    if (!existingNode) return;

    this.selectNode(existingNode.id);
  }

  selectNode(nodeId: string | null): void {
    this.selectedNodeId.set(nodeId);

    this.nodes.update((nodes) =>
      nodes.map((node) => ({
        ...node,
        selected: node.id === nodeId,
      }))
    );
  }

  addAttributeToSelectedNode(attribute: Omit<AttributeModel, 'id'>): boolean {
    const selectedId = this.selectedNodeId();
    if (!selectedId) return false;

    const cleanName = attribute.name.trim().toLowerCase();
    if (!cleanName) return false;

    const selectedNode = this.selectedNode();
    if (!selectedNode) return false;

    const alreadyExists = selectedNode.attributes.some(
      (item) => item.name.trim().toLowerCase() === cleanName
    );

    if (alreadyExists) return false;

    const newAttribute: AttributeModel = {
      id: crypto.randomUUID(),
      name: cleanName,
      type: attribute.type,
      length: attribute.length,
      description: attribute.description.trim(),
      isPrimaryKey: attribute.isPrimaryKey,
    };

    this.nodes.update((nodes) =>
      nodes.map((node) => {
        if (node.id !== selectedId) return node;

        return {
          ...node,
          attributes: [...node.attributes, newAttribute],
        };
      })
    );

    this.recalculateIntegrity();
    return true;
  }

  removeAttributeFromSelectedNode(attributeId: string): void {
    const selectedId = this.selectedNodeId();
    if (!selectedId) return;

    this.nodes.update((nodes) =>
      nodes.map((node) => {
        if (node.id !== selectedId) return node;

        return {
          ...node,
          attributes: node.attributes.filter((attribute) => attribute.id !== attributeId),
        };
      })
    );

    this.recalculateIntegrity();
  }

  addRelation(relation: Omit<RelationModel, 'id'>): boolean {
    const cleanName = relation.name.trim();

    if (!cleanName || relation.fromEntityId === relation.toEntityId) return false;

    const fromExists = this.nodes().some((node) => node.id === relation.fromEntityId);
    const toExists = this.nodes().some((node) => node.id === relation.toEntityId);

    if (!fromExists || !toExists) return false;

    const alreadyExists = this.relations().some(
      (item) =>
        item.fromEntityId === relation.fromEntityId &&
        item.toEntityId === relation.toEntityId &&
        item.name.trim().toLowerCase() === cleanName.toLowerCase() &&
        item.cardinality === relation.cardinality
    );

    if (alreadyExists) return false;

    this.relations.update((relations) => [
      ...relations,
      {
        id: crypto.randomUUID(),
        fromEntityId: relation.fromEntityId,
        toEntityId: relation.toEntityId,
        name: cleanName,
        cardinality: relation.cardinality,
      },
    ]);

    this.recalculateIntegrity();
    return true;
  }

  removeRelation(relationId: string): void {
    this.relations.update((relations) => relations.filter((relation) => relation.id !== relationId));
    this.recalculateIntegrity();
  }

  resetRelations(): void {
    this.relations.set([]);
    this.recalculateIntegrity();
  }

  getEntityNameById(entityId: string): string {
    return this.nodes().find((node) => node.id === entityId)?.name ?? 'Entidad eliminada';
  }

  hasMainEntity(expectedEntityName: string): boolean {
    return this.nodes().some(
      (node) => node.name.trim().toUpperCase() === expectedEntityName.trim().toUpperCase()
    );
  }

  getNodeByName(entityName: string): EntityNodeModel | null {
    return (
      this.nodes().find(
        (node) => node.name.trim().toUpperCase() === entityName.trim().toUpperCase()
      ) ?? null
    );
  }

  recalculateIntegrity(): void {
    const nodes = this.nodes();

    if (nodes.length === 0) {
      this.integrity.set(0);
      return;
    }

    const totalAttributes = nodes.reduce((total, node) => total + node.attributes.length, 0);
    const entitiesWithPk = nodes.filter((node) =>
      node.attributes.some((attribute) => attribute.isPrimaryKey)
    ).length;

    let value = 35;

    if (nodes.length >= 1) value = 45;
    if (totalAttributes >= nodes.length) value = 60;
    if (totalAttributes >= nodes.length * 2) value = 75;
    if (entitiesWithPk === nodes.length && totalAttributes >= nodes.length * 2) value = 90;
    if (this.relations().length > 0 && value >= 75) value = 95;

    this.integrity.set(Math.min(value, 100));
  }

  reset(): void {
    this.integrity.set(0);
    this.nodes.set([]);
    this.relations.set([]);
    this.selectedNodeId.set(null);
  }
}
