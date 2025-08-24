import { Component, inject } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
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
