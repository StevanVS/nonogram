import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() left: { path: string; icon: string }[] | null = [];
  @Input() right: { path: string; icon: string }[] | null = [];
  @Input() relative: boolean = false;
}
