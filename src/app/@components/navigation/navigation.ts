import {
  Component,
  effect,
  inject,
  Input,
  OnInit,
  Signal,
} from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/UsersService';
import { finalize, Observable, Subscription } from 'rxjs';
import { User } from '../../services/interfaces/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})
export class Navigation implements OnInit {
  userSub!: Subscription;
  userData: User = {} as User;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    effect(() => {
      this.userData = this.userService.userData()();
    });
  }

  ngOnInit() {
    //this.userData =  this.userService.userData();
    console.log(this.userData, ' this.userData');
  }

  // goToUser(user: string) {
  //   // Navigates to absolute path: /home/user/username
  //   this.router.navigate(['/home', 'user', user]);
  // }

  logOut() {
    this.authService
      .logOut()
      .pipe(finalize(() => this.router.navigate(['login'])))
      .subscribe({
        next: (res: any) => {
          console.log(res, ' res');
        },
        error: (err: any) => {
          console.log(
            'An error has occurred attempting to log you out. Error: ',
            err,
          );
        },
      });
  }

  ngOnDestroy() {
    // Prevent memory leaks by unsubscribing manually
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
