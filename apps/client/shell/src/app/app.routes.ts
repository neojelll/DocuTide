import { Route } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';

export const appRoutes: Route[] = [
  {
    path: 'document_editor',
    loadChildren: () =>
      import('document_editor/Routes').then((m) => m?.remoteRoutes),
  },
  {
    path: 'project_view',
    loadChildren: () =>
      import('project_view/Routes').then((m) => m?.remoteRoutes),
  },
  {
    path: 'projects_feed',
    loadChildren: () =>
      import('projects_feed/Routes').then((m) => m?.remoteRoutes),
  },
  {
    path: 'user_profile',
    loadChildren: () =>
      import('user_profile/Routes').then((m) => m?.remoteRoutes),
  },
  {
    path: 'login',
    loadChildren: () => import('login/Routes').then((m) => m?.remoteRoutes),
  },
  {
    path: '',
    component: NxWelcomeComponent,
  },
];
