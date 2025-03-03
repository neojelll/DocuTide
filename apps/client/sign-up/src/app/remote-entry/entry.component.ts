import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RegisterComponent } from './register/register.component';

@Component({
  imports: [CommonModule, RegisterComponent],
  selector: 'app-register-entry',
  template: `<app-register></app-register>`,
})
export class RemoteEntryComponent {}
