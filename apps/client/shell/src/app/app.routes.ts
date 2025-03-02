import { Route } from '@angular/router';
import { AppComponent } from './app.component';

export const appRoutes: Route[] = [
  {
    path: 'sign-up',
    loadChildren: () => import('sign-up/Routes').then((m) => m?.remoteRoutes),
  },
  {
    path: '',
    component: AppComponent,
  },
];
