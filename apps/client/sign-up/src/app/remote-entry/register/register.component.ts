import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss'],
  imports: [ReactiveFormsModule, HttpClientModule],
})
export class RegisterComponent {
  http = inject(HttpClient);
  form = new FormGroup({
    email: new FormControl<null | string>(null, Validators.required),
    username: new FormControl<null | string>(null, Validators.required),
    password: new FormControl<null | string>(null, Validators.required),
  });

  onSubmit() {
    this.http
      .post('http://localhost:3000/api/v1/auth/sign-up', {
        ...this.form.value,
        notificationEnabled: true,
      })
      .subscribe(
        (response) => {
          console.log('Response:', response);
        },
        (error) => {
          console.error('Error:', error);
        },
      );
  }
}
