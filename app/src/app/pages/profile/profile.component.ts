import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  authService = inject(AuthService);
  router = inject(Router);

  onLogOut() {
    this.authService.logout().subscribe({
      next: (res) => {
        this.router.navigateByUrl('/');
      },
      error: console.error,
    });
  }
}
