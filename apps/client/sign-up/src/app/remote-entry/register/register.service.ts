import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  http = inject(HttpClient);

  register(data: { email: string; username: string; password: string }) {
    return this.http.post('http://localhost:3000/api/v1/auth-sign-up', data);
  }
}
