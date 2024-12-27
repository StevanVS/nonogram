import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;

  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
        ],
      ],
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        const response = await this.authService.login(
          this.loginForm.get('email')?.value,
          this.loginForm.get('password')?.value,
        );
        console.log('res', response);
      } catch (error) {
        console.log('err', error);
      }
    } else {
      console.log('loginForm error');
    }
  }
}
