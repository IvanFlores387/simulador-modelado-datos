import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LevelConfigModel } from '../../core/models/level-config.model';
import { LevelConfigService } from '../../core/services/level-config.service';
import { SimulatorStateService } from '../../core/services/simulator-state.service';
import { ValidationService } from '../../core/services/validation.service';
import { AudioService } from '../../core/services/audio.service';

@Component({
  selector: 'app-levels',
  imports: [CommonModule],
  templateUrl: './levels.html',
  styleUrl: './levels.scss',
})
export class Levels implements OnDestroy {
  private readonly router = inject(Router);
  private readonly levelConfigService = inject(LevelConfigService);
  private readonly simulatorStateService = inject(SimulatorStateService);
  private readonly validationService = inject(ValidationService);
  private readonly audioService = inject(AudioService);

  readonly levels = this.levelConfigService.getAllLevels();

  isMusicPlaying = false;

  toggleMusic(): void {
    if (this.isMusicPlaying) {
      this.audioService.stopLoop();
      this.isMusicPlaying = false;
      return;
    }

    this.audioService.playLoop('/assets/audio/levels.mp3', 0.25);
    this.isMusicPlaying = true;
  }

  startLevel(level: LevelConfigModel): void {
    this.audioService.stopLoop();
    this.isMusicPlaying = false;

    this.levelConfigService.setCurrentLevel(level.id);
    this.simulatorStateService.reset();
    this.validationService.clearResult();
    this.router.navigate(['/narrativa']);
  }

  goBack(): void {
    this.audioService.stopLoop();
    this.isMusicPlaying = false;
    this.router.navigate(['/bienvenida']);
  }

  ngOnDestroy(): void {
    this.audioService.stopLoop();
    this.isMusicPlaying = false;
  }
}
