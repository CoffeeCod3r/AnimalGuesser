// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { GameComponent } from './components/game/game';
import { CatGameComponent } from './components/cat-game/cat-game';
import { DogGameComponent } from './components/dog-game/dog-game';

export const routes: Routes = [
  { path: '', redirectTo: '/cats', pathMatch: 'full' },
  { path: 'animals', component: GameComponent },
  { path: 'cats', component: CatGameComponent },
  { path: 'dogs', component: DogGameComponent },
  { path: '**', redirectTo: '' },
];
