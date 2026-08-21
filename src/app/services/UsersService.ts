import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
// import { menuItem } from '../../../server/models/menuItem.js'
import { BehaviorSubject } from 'rxjs';
import { User } from './interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:4200/api/';
  private userDataSubject = new BehaviorSubject<User | null>(null);
  public userData$ = this.userDataSubject.asObservable();
  private http = inject(HttpClient);

  getProfileData(endpoint: string): Observable<any> {
    return this.http.get<User>(this.apiUrl + endpoint).pipe(
      tap((data) => {
        this.setUserData(data);
      }),
    );
  }

  getUserData(username: string): Observable<any> {
    console.log(username, ' username');
    return this.http
      .get<any>(this.apiUrl + `getUserData/${username}`, {
        params: { username: username },
      })
      .pipe(
        tap((data) => {
          this.setUserData(data);
        }),
      );
  }

  setUserData(newValue: User) {
    console.log(
      'the user being set in Global Subject setUserData Call: ',
      newValue,
    );
    this.userDataSubject.next(newValue);

  }
}
