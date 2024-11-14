import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // set value in local storage
  setItem<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // get value from local storage
  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item);
  }

  // remove value from local storage
  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  // clear all values from local storage
  clear() {
    localStorage.clear();
  }
}
