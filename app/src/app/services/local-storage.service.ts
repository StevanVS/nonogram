import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // set value in local storage
  setItem(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  // get value from local storage
  getItem(key: string):any  {
    if (localStorage.getItem(key) == null) return null;
    return JSON.parse(localStorage.getItem(key) || '{}');
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
