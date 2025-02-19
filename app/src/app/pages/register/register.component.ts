import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  form: FormGroup;

  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);

  constructor() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
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
    if (!this.form.valid) {
      console.log('form invalid');
      return;
    }
    const { username, email, password } = this.form.value;

    try {
      const res = await this.authService.register(username, email, password);
      console.log({ res });
    } catch (error) {
      console.log({ error });
    }
  }
}
