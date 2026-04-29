import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private backgroundAudio: HTMLAudioElement | null = null;

  playLoop(path: string, volume = 0.35): void {
    this.stopLoop();

    this.backgroundAudio = new Audio(path);
    this.backgroundAudio.loop = true;
    this.backgroundAudio.volume = volume;

    this.backgroundAudio.play().catch(() => {
      console.warn('El navegador bloqueó la reproducción automática del audio.');
    });
  }

  stopLoop(): void {
    if (!this.backgroundAudio) return;

    this.backgroundAudio.pause();
    this.backgroundAudio.currentTime = 0;
    this.backgroundAudio = null;
  }

  playEffect(path: string, volume = 0.7): void {
    const effect = new Audio(path);
    effect.volume = volume;

    effect.play().catch(() => {
      console.warn('El navegador bloqueó el efecto de sonido.');
    });
  }
}
