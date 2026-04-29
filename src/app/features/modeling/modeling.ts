import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataType } from '../../core/models/attribute.model';
import { RelationCardinality } from '../../core/models/relation.model';
import { AudioService } from '../../core/services/audio.service';
import { LevelConfigService } from '../../core/services/level-config.service';
import { SimulatorStateService } from '../../core/services/simulator-state.service';
import { ValidationService } from '../../core/services/validation.service';

@Component({
  selector: 'app-modeling',
  imports: [CommonModule, FormsModule],
  templateUrl: './modeling.html',
  styleUrl: './modeling.scss',
})
export class Modeling implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly audioService = inject(AudioService);

  readonly levelConfigService = inject(LevelConfigService);
  readonly simulatorStateService = inject(SimulatorStateService);
  readonly validationService = inject(ValidationService);

  readonly attributeName = signal<string>('');
  readonly attributeType = signal<DataType>('INT');
  readonly attributeLength = signal<number | null>(null);
  readonly attributeDescription = signal<string>('');
  readonly attributeIsPrimaryKey = signal<boolean>(false);

  readonly customEntityName = signal<string>('');

  readonly relationFromEntityId = signal<string>('');
  readonly relationToEntityId = signal<string>('');
  readonly relationName = signal<string>('');
  readonly relationCardinality = signal<RelationCardinality>('1:N');

  readonly formError = signal<string>('');
  readonly formSuccess = signal<string>('');
  readonly relationError = signal<string>('');
  readonly relationSuccess = signal<string>('');

  ngOnInit(): void {
    this.audioService.playLoop('/assets/audio/accion.mp3', 0.28);
  }

  ngOnDestroy(): void {
    this.audioService.stopLoop();
  }

  createMainEntity(): void {
    this.clearMessages();
    const entityName = this.levelConfigService.currentLevel().expectedEntityName;
    this.simulatorStateService.createEntity(entityName);
    this.formSuccess.set(`Entidad ${entityName} lista para trabajar.`);
  }

  createExpectedEntity(entityName: string): void {
    this.clearMessages();
    this.simulatorStateService.createEntity(entityName);
    this.formSuccess.set(`Entidad ${entityName} lista para trabajar.`);
  }

  createCustomEntity(): void {
    this.clearMessages();
    const entityName = this.customEntityName().trim();

    if (!entityName) {
      this.formError.set('Escribe el nombre de la entidad que deseas crear.');
      return;
    }

    if (!this.isValidAttributeName(entityName)) {
      this.formError.set('El nombre de la entidad debe iniciar con una letra y solo usar letras, números y guion bajo.');
      return;
    }

    this.simulatorStateService.createEntity(entityName);
    this.customEntityName.set('');
    this.formSuccess.set(`Entidad ${entityName.toUpperCase()} lista para trabajar.`);
  }

  selectNode(nodeId: string): void {
    this.simulatorStateService.selectNode(nodeId);
    this.clearMessages();
  }

  goBack(): void {
    this.router.navigate(['/narrativa']);
  }

  goToHelp(): void {
    this.router.navigate(['/ayuda']);
  }

  validateModel(): void {
    this.audioService.stopLoop();

    const result = this.validationService.validateCurrentLevel();

    if (result.isValid) {
      this.audioService.playEffect('/assets/audio/yay.mp3', 0.75);
    } else {
      this.audioService.playEffect('/assets/audio/error.mp3', 0.7);
    }

    this.router.navigate(['/resultado']);
  }

  resetLevel(): void {
    const confirmed = confirm('¿Seguro que deseas reiniciar el nivel? Se perderá el modelo actual.');

    if (!confirmed) return;

    this.simulatorStateService.reset();
    this.validationService.clearResult();
    this.resetForm();
    this.resetRelationForm();
    this.formSuccess.set('Nivel reiniciado correctamente.');
  }

  removeAttribute(attributeId: string): void {
    const confirmed = confirm('¿Seguro que deseas eliminar este atributo?');

    if (!confirmed) return;

    this.simulatorStateService.removeAttributeFromSelectedNode(attributeId);
    this.formError.set('');
    this.formSuccess.set('Atributo eliminado correctamente.');
  }

  removeRelation(relationId: string): void {
    const confirmed = confirm('¿Seguro que deseas eliminar esta relación?');

    if (!confirmed) return;

    this.simulatorStateService.removeRelation(relationId);
    this.relationError.set('');
    this.relationSuccess.set('Relación eliminada correctamente.');
  }

  onAttributeNameChange(value: string): void {
    this.attributeName.set(value);
  }

  onAttributeTypeChange(value: DataType): void {
    this.attributeType.set(value);

    if (value !== 'VARCHAR') {
      this.attributeLength.set(null);
    }
  }

  onAttributeLengthChange(value: string | number | null): void {
    if (value === null || value === '') {
      this.attributeLength.set(null);
      return;
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      this.attributeLength.set(null);
      return;
    }

    this.attributeLength.set(parsed);
  }

  onAttributeDescriptionChange(value: string): void {
    this.attributeDescription.set(value);
  }

  onPrimaryKeyChange(value: boolean): void {
    this.attributeIsPrimaryKey.set(value);
  }

  onCustomEntityNameChange(value: string): void {
    this.customEntityName.set(value);
  }

  onRelationFromChange(value: string): void {
    this.relationFromEntityId.set(value);
  }

  onRelationToChange(value: string): void {
    this.relationToEntityId.set(value);
  }

  onRelationNameChange(value: string): void {
    this.relationName.set(value);
  }

  onRelationCardinalityChange(value: RelationCardinality): void {
    this.relationCardinality.set(value);
  }

  saveAttribute(): void {
    this.clearMessages();

    const selectedNode = this.simulatorStateService.selectedNode();
    if (!selectedNode) {
      this.formError.set('Primero debes seleccionar una entidad.');
      return;
    }

    const attributeName = this.attributeName().trim();

    if (!attributeName) {
      this.formError.set('El nombre del atributo es obligatorio.');
      return;
    }

    if (!this.isValidAttributeName(attributeName)) {
      this.formError.set('El nombre del atributo debe iniciar con una letra y solo puede usar letras, números y guion bajo.');
      return;
    }

    const attributeType = this.attributeType();
    const attributeLength = this.attributeLength();

    if (attributeType === 'VARCHAR' && (!attributeLength || !Number.isInteger(attributeLength) || attributeLength <= 0)) {
      this.formError.set('Para VARCHAR debes indicar una longitud válida. Ejemplo: 150.');
      return;
    }

    const created = this.simulatorStateService.addAttributeToSelectedNode({
      name: attributeName,
      type: attributeType,
      length: attributeType === 'VARCHAR' ? attributeLength : null,
      description: this.attributeDescription(),
      isPrimaryKey: this.attributeIsPrimaryKey(),
    });

    if (!created) {
      this.formError.set('No se pudo guardar el atributo. Verifica que no esté repetido.');
      return;
    }

    this.formSuccess.set('Atributo guardado correctamente.');
    this.resetForm();
  }

  saveRelation(): void {
    this.relationError.set('');
    this.relationSuccess.set('');

    if (this.simulatorStateService.nodes().length < 2) {
      this.relationError.set('Necesitas al menos dos entidades para crear una relación.');
      return;
    }

    const name = this.relationName().trim();

    if (!this.relationFromEntityId() || !this.relationToEntityId()) {
      this.relationError.set('Selecciona entidad origen y entidad destino.');
      return;
    }

    if (this.relationFromEntityId() === this.relationToEntityId()) {
      this.relationError.set('La entidad origen y destino no pueden ser la misma.');
      return;
    }

    if (!name) {
      this.relationError.set('Escribe el nombre de la relación.');
      return;
    }

    const created = this.simulatorStateService.addRelation({
      fromEntityId: this.relationFromEntityId(),
      toEntityId: this.relationToEntityId(),
      name,
      cardinality: this.relationCardinality(),
    });

    if (!created) {
      this.relationError.set('No se pudo guardar la relación. Verifica que no esté repetida.');
      return;
    }

    this.relationSuccess.set('Relación guardada correctamente.');
    this.resetRelationForm();
  }

  private isValidAttributeName(value: string): boolean {
    return /^[a-zA-Z_áéíóúÁÉÍÓÚñÑ][a-zA-Z0-9_áéíóúÁÉÍÓÚñÑ]*$/.test(value);
  }

  private resetForm(): void {
    this.attributeName.set('');
    this.attributeType.set('INT');
    this.attributeLength.set(null);
    this.attributeDescription.set('');
    this.attributeIsPrimaryKey.set(false);
  }

  private resetRelationForm(): void {
    this.relationFromEntityId.set('');
    this.relationToEntityId.set('');
    this.relationName.set('');
    this.relationCardinality.set('1:N');
  }

  private clearMessages(): void {
    this.formError.set('');
    this.formSuccess.set('');
  }
}
