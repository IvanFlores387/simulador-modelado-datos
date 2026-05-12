import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
export class Levels implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly levelConfigService = inject(LevelConfigService);
  private readonly simulatorStateService = inject(SimulatorStateService);
  private readonly validationService = inject(ValidationService);
  private readonly audioService = inject(AudioService);

  readonly levels = this.levelConfigService.getAllLevels();

  ngOnInit(): void {
    this.playBackgroundMusic();
  }

  private playBackgroundMusic(): void {
    this.audioService.playLoop('/assets/audio/levels.mp3', 0.25);
  }

  private stopBackgroundMusic(): void {
    this.audioService.stopLoop();
  }

  startLevel(level: LevelConfigModel): void {
    this.stopBackgroundMusic();

    this.levelConfigService.setCurrentLevel(level.id);
    this.simulatorStateService.reset();
    this.validationService.clearResult();
    this.router.navigate(['/narrativa']);
  }

  goBack(): void {
    this.stopBackgroundMusic();
    this.router.navigate(['/bienvenida']);
  }

  ngOnDestroy(): void {
    this.stopBackgroundMusic();
  }
}
