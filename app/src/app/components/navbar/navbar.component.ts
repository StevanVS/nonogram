import { Component, Input } from '@angular/core';

type navbarIcon = {
  path: string;
  icon: string;
  labelRight?: string;
  labelLeft?: string;
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() left: navbarIcon[] | null = [];
  @Input() right: navbarIcon[] | null = [];
  @Input() relative: boolean = false;
}
