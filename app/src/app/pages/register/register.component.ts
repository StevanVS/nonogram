import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  isPasswordShown = false;

  registerForm: FormGroup;

  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          ),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
    });
  }

  onChangePasswordVisibility() {
    this.isPasswordShown = !this.isPasswordShown;
  }

  onSubmit() {
    if (!this.registerForm.valid) {
      console.log('form invalid');
      return;
    }

    const { username, email, password } = this.registerForm.value;

    this.authService.register(username, email, password).subscribe({
      next: (res) => {
        console.log({ res });
        this.router.navigateByUrl('/');
      },
      error: console.error,
    });
  }
}
