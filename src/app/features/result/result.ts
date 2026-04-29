import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationIssueModel } from '../../core/models/validation-result.model';
import { ValidationService } from '../../core/services/validation.service';

@Component({
  selector: 'app-result',
  imports: [CommonModule],
  templateUrl: './result.html',
  styleUrl: './result.scss',
})
export class Result {
  private readonly router = inject(Router);
  readonly validationService = inject(ValidationService);

  readonly entityIssues = computed(() => this.filterIssues('entity'));
  readonly attributeIssues = computed(() => this.filterIssues('attribute'));
  readonly relationIssues = computed(() => this.filterIssues('relation'));
  readonly generalIssues = computed(() => this.filterIssues('general'));

  goToModeling(): void {
    this.router.navigate(['/modelado']);
  }

  goToLevels(): void {
    this.router.navigate(['/niveles']);
  }

  goToWelcome(): void {
    this.router.navigate(['/bienvenida']);
  }

  private filterIssues(type: NonNullable<ValidationIssueModel['type']>): ValidationIssueModel[] {
    return this.validationService.lastResult()?.issues.filter((issue) => issue.type === type) ?? [];
  }
}
