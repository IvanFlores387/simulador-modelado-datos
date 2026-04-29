import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LevelConfigModel } from '../../core/models/level-config.model';
import { LevelConfigService } from '../../core/services/level-config.service';
import { SimulatorStateService } from '../../core/services/simulator-state.service';
import { ValidationService } from '../../core/services/validation.service';

@Component({
  selector: 'app-levels',
  imports: [CommonModule],
  templateUrl: './levels.html',
  styleUrl: './levels.scss',
})
export class Levels {
  private readonly router = inject(Router);
  private readonly levelConfigService = inject(LevelConfigService);
  private readonly simulatorStateService = inject(SimulatorStateService);
  private readonly validationService = inject(ValidationService);

  readonly levels = this.levelConfigService.getAllLevels();

  startLevel(level: LevelConfigModel): void {
    this.levelConfigService.setCurrentLevel(level.id);
    this.simulatorStateService.reset();
    this.validationService.clearResult();
    this.router.navigate(['/narrativa']);
  }

  goBack(): void {
    this.router.navigate(['/bienvenida']);
  }
}
