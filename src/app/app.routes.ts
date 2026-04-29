import { Routes } from '@angular/router';
import { Welcome } from './features/welcome/welcome';
import { Narrative } from './features/narrative/narrative';
import { Modeling } from './features/modeling/modeling';
import { Help } from './features/help/help';
import { Result } from './features/result/result';
import { Levels } from './features/levels/levels';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'bienvenida',
    pathMatch: 'full',
  },
  {
    path: 'bienvenida',
    component: Welcome,
  },
  {
    path: 'niveles',
    component: Levels,
  },
  {
    path: 'narrativa',
    component: Narrative,
  },
  {
    path: 'modelado',
    component: Modeling,
  },
  {
    path: 'ayuda',
    component: Help,
  },
  {
    path: 'resultado',
    component: Result,
  },
  {
    path: '**',
    redirectTo: 'bienvenida',
  },
];
