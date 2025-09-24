import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastNotification } from './toast-notification.model';

@Injectable({
  providedIn: 'root',
})
export class ToastNotificationService {
  private notificationListSubject = new BehaviorSubject<ToastNotification[]>(
    [],
  );

  public notificationList$ = this.notificationListSubject.asObservable();

  constructor() {
    // this.newNotification({
    //   type: 'SUCCESS',
    //   message: 'hola',
    // });
    // setTimeout(() => {
    //   this.newNotification({
    //     type: 'ERROR',
    //     message: 'Algo malo ha pasado con el servidor',
    //   });
    // }, 1000);
  }

  newNotification(notification: ToastNotification) {
    const currentList = this.notificationListSubject.getValue();

    notification.id = new Date().getTime();

    this.notificationListSubject.next([...currentList, notification]);

    setTimeout(() => {
      this.clearNotification(notification.id || 0);
    }, notification.time || 5000);
  }

  clearNotification(id: number) {
    const currentList = this.notificationListSubject.getValue();
    const newList = currentList.filter((n) => n.id !== id);
    this.notificationListSubject.next(newList);
  }
}
