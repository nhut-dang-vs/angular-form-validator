import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  validateUsername(username: string): Observable<boolean> {
    console.log('trigger api');

    let existedUsers = ['trungvo', 'tieppt', 'chautran'];
    let isValid = existedUsers.every((x) => x !== username);
    return of(isValid).pipe(delay(1000));
  }
}
