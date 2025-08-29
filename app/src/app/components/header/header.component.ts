import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  user: User | null = null;

  isHome = false;

  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit() {
    // this.user = this.authService.user$.value;
    this.authService.user$.subscribe({
      next: (res) => {
        this.user = res;
      },
      error: console.error,
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((result) => {
        this.isHome = result.url === '/'
      });
  }
}
