import { Injectable, Inject, signal, effect, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoggedInUser, User } from './interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:4200/api/';

  login(credentials: LoggedInUser): Observable<any> {
    console.log('credentials: ', credentials);
    return this.http.post<any>(this.apiUrl + 'login', credentials ).pipe(
      tap((data) => {
        console.log('LoggedIn User Data:', data);
      }),
    );
  }

  logOut(user: User) {
    console.log('user is logging out: ', user);
  }
}
