import { NxWelcomeComponent } from './nx-welcome.component';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'project_management',
    loadChildren: () =>
      import('project_management/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'document_editor',
    loadChildren: () =>
      import('document_editor/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'project_service',
    loadChildren: () =>
      import('project_service/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'projects_feed',
    loadChildren: () =>
      import('projects_feed/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'user_profile',
    loadChildren: () =>
      import('user_profile/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'login',
    loadChildren: () => import('login/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: '',
    component: NxWelcomeComponent,
  },
];
