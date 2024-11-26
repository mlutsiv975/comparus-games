import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/reaction-game',
    pathMatch: 'full'
  },
  {
    title: 'Reaction Game',
    loadComponent: () => import('./pages/reaction-game/reaction-game.component').then(c => c.ReactionGameComponent),
    path: 'reaction-game',
  }
];
