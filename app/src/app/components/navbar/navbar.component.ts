import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  authService = inject(AuthService);

  user: User | null = null;

  ngOnInit() {
    // this.user = this.authService.user$.value;
    this.authService.user$.subscribe({
      next: (res) => {
        this.user = res;
      },
      error: (error) => console.log(error),
    });
  }
}
