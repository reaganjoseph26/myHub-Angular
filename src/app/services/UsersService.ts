import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
// import { menuItem } from '../../../server/models/menuItem.js'
import { BehaviorSubject } from 'rxjs';
import { User } from './interfaces/user';
import { Post } from './interfaces/post';
import { convertDateTime } from '../@shared/utils/dateHelper';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:4200/api/';
  // private userDataSubject = new BehaviorSubject<User | null>(null);
  // public userData$ = this.userDataSubject.asObservable();
  private userDataSignal = signal<User>({} as User);
  readonly userData = this.userDataSignal.asReadonly();
  private http = inject(HttpClient);
  readonly userFollowerCount = signal(0);
  readonly userFollowingCount = signal(0);

  getProfileData(endpoint: string): Observable<any> {
    return this.http.get<User>(this.apiUrl + endpoint).pipe(
      tap((data) => {
        this.setUserData(data);
      }),
    );
  }

  getUserData(): Observable<any> {
    return this.http
      .get<any>(this.apiUrl + `getUserData`, {
        withCredentials: true,
      })
      .pipe(
        tap((data) => {
          //console.log(data, ' data');

          if (data && data.followers.length > 0) {
            this.setFollowerCount(data.followers.length);
          }

          if (data && data.following.length > 0) {
            this.setFollowingCount(data.following.length);
          }

          this.setUserData(data);
        }),
      );
  }

  setUserData(newValue: User) {
    // console.log(
    //   'the user being set in Global Subject setUserData Call: ',
    //   newValue,
    // );
    this.userDataSignal.set(newValue);
    //this.userDataSubject.next(newValue);
  }

  setFollowerCount(count: number) {
    this.userFollowerCount.set(count);
  }

  setFollowingCount(count: number) {
    this.userFollowingCount.set(count);
  }

  getUserPosts(): Observable<Post[]> {
    return this.http
      .get<Post[]>(this.apiUrl + `getUserPosts`, {
        withCredentials: true,
      })
      .pipe(
        map((posts) =>
          posts.map((post) => ({
            ...post,
            createdAt: convertDateTime(post.createdAt),
          })),
        ),
      );
  }
  getHubbiesPosts(hubbies: string[]): Observable<any> {
    return this.http
      .get<Post[]>(this.apiUrl + `getHubbiesPosts`, {
        withCredentials: true,
        params: {
          hubbies: JSON.stringify(hubbies),
        },
      })
      .pipe(
        map((posts) =>
          posts.map((post) => ({
            ...post,
            createdAt: convertDateTime(post.createdAt),
            replies: post.replies
              ? post.replies.map((reply) => ({
                  ...reply,
                  createdAt: convertDateTime(reply.createdAt),
                }))
              : [],
          })),
        ),
      );
  }

  createPost(post: string, replyToId?: string): Observable<Post> {
    return this.http.post<Post>(
      this.apiUrl + `post`,
      { post: post, replyToId: replyToId },
      {
        withCredentials: true,
      },
    );
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete(this.apiUrl + `deletePost/${postId}`, {
      withCredentials: true,
    });
  }

  updateUserData(body: User): Observable<User> {
    return this.http
      .post<User>(this.apiUrl + `post`, body, {
        withCredentials: true,
      })
      .pipe(
        tap((data) => {
          this.setUserData(data);
        }),
      );
  }
}
