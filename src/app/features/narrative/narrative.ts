import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../core/services/audio.service';
import { LevelConfigService } from '../../core/services/level-config.service';

@Component({
  selector: 'app-narrative',
  imports: [],
  templateUrl: './narrative.html',
  styleUrl: './narrative.scss',
})
export class Narrative implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly audioService = inject(AudioService);

  readonly levelConfigService = inject(LevelConfigService);

  ngOnInit(): void {
    this.audioService.playLoop('/assets/audio/inicio.mp3', 0.25);
  }

  ngOnDestroy(): void {
    this.audioService.stopLoop();
  }

  startLevel(): void {
    this.audioService.stopLoop();
    this.router.navigate(['/modelado']);
  }

  goToHelp(): void {
    this.audioService.stopLoop();
    this.router.navigate(['/ayuda']);
  }

  goBack(): void {
    this.audioService.stopLoop();
    this.router.navigate(['/niveles']);
  }
}
