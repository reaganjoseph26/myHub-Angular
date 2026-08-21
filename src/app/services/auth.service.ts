import {
  Injectable,
  Inject,
  signal,
  effect,
  inject,
  computed,
  PLATFORM_ID,
} from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  Subscription,
  tap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoggedInUser, NewUser, User } from './interfaces/user';
import { Router } from '@angular/router';
import { UserService } from './UsersService';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:4200/api/';
  private router = inject(Router);
  private userservice = inject(UserService);

  private readonly _isLoggedIn = signal<string>(
    sessionStorage.getItem('isLoggedIn') ?? 'false',
  );
  public readonly isLoggedIn = computed(() => this._isLoggedIn());
  private platformId = inject(PLATFORM_ID);
  private TOKEN_KEY!: string;

  verifyToken(): Observable<boolean> {
    
    return this.http
      .get<any>(this.apiUrl + 'validateToken', {
        //headers: { Authorization: `Bearer ${token}` }
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          console.log(user, 'user');
          this.setIsLoggedIn('true');
        }),
        map(() => true),
        catchError(() => {
          this.setIsLoggedIn('false');
          // Token is invalid or expired
          this.setIsLoggedIn('true');
        

          return of(false); // Return true or false, but don't crash the app initializer
        }),
      );
  }

 

  

 

  login(credentials: LoggedInUser): Observable<any> {
    //console.log('credentials: ', credentials);
    return this.http.post<any>(this.apiUrl + 'login', credentials).pipe(
      tap((data) => {
        // this._isLoggedIn.set(true);
        console.log('LoggedIn User Data:', data);
        this.setIsLoggedIn('true');
        
        this.userservice.setUserData(data.user);

        console.log(this.userservice.userData$);
        // this._isLoggedIn.set(true);
      }),
    );
  }

  signup(credentials: NewUser): Observable<any> {
    console.log('credentials: ', credentials);
    return this.http.post<any>(this.apiUrl + 'signup', credentials).pipe(
      tap((data) => {
        console.log('New User Data:', data);
      
        this.userservice.setUserData(data);
        // this._isLoggedIn.set(true);
      }),
    );
  }

  logOut() {
    return this.http.post<any>(this.apiUrl + 'logOut', {}).pipe(
      tap({
        next: (data) => {
         
         
          this.setIsLoggedIn('false');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.log('Error logging out.', err);
        },
      }),
    );
  }

  setIsLoggedIn(value: string) {
    this._isLoggedIn.set(value);
    sessionStorage.setItem('isLoggedIn', value);
  }
}
