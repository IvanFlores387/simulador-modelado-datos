import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help',
  imports: [],
  templateUrl: './help.html',
  styleUrl: './help.scss',
})
export class Help {
  private readonly router = inject(Router);

  goBack(): void {
    this.router.navigate(['/narrativa']);
  }

  goToModeling(): void {
    this.router.navigate(['/modelado']);
  }
}
