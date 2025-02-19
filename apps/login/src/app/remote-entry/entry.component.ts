import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginComponent } from './login.component';

@Component({
  imports: [CommonModule, LoginComponent],
  selector: 'app-login-entry',
  template: `<login-component></login-component>`,
})
export class RemoteEntryComponent {}
