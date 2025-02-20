import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  imports: [CommonModule, NxWelcomeComponent],
  selector: 'app-project_management-entry',
  template: `<app-nx-welcome></app-nx-welcome>`,
})
export class RemoteEntryComponent {}
