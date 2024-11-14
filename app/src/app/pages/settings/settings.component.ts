import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  localStorageService = inject(LocalStorageService)
  router = inject(Router)

  constructor() { }

  onDeleteData() {
    this.localStorageService.clear()
    this.router.navigate(['/'])
  }
}
