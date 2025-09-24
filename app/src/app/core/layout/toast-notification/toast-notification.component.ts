import { Component, inject } from '@angular/core';
import { AsyncPipe, NgClass, TitleCasePipe } from '@angular/common';
import { ToastNotificationService } from './toast-notification.service';

@Component({
  selector: 'app-toast-notification',
  imports: [NgClass, TitleCasePipe, AsyncPipe],
  templateUrl: './toast-notification.component.html',
  styleUrl: './toast-notification.component.css',
})
export class ToastNotificationComponent {
  toastNotificationService = inject(ToastNotificationService);
}
