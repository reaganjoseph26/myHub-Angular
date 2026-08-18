import { Injectable, Inject, signal, effect, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoggedInUser, NewUser, User } from './interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:4200/api/';

  hasAccess(): boolean {
    //return this.currentUser() !== null;
    return true;
  }

  isLoggedIn():boolean {
    return true;
  }

  login(credentials: LoggedInUser): Observable<any> {
    console.log('credentials: ', credentials);
    return this.http.post<any>(this.apiUrl + 'login', credentials).pipe(
      tap((data) => {
        console.log('LoggedIn User Data:', data);
      }),
    );
  }

  signup(credentials: NewUser): Observable<any> {
    console.log('credentials: ', credentials);
    return this.http.post<any>(this.apiUrl + 'signup', credentials).pipe(
      tap((data) => {
        console.log('New User Data:', data);
      }),
    );
  }

  logOut(user: User) {
    console.log('user is logging out: ', user);
  }
}
