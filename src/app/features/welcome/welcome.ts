import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class Welcome {
  constructor(private readonly router: Router) {}

  goToLevels(): void {
    this.router.navigate(['/niveles']);
  }

  goToNarrative(): void {
    this.router.navigate(['/narrativa']);
  }

  goToHelp(): void {
    this.router.navigate(['/ayuda']);
  }
}
