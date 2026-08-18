import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/UsersService';
import { Navigation } from '../navigation/navigation';
import { Router } from '@angular/router';
import { User } from '../../services/interfaces/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  userSub!: Subscription;
  userData!: User | null;
  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    console.log('home component');
    this.userSub = this.userService.userData$.subscribe({
      next: (data) => {
        this.userData = data;
      },
      error: (err) => {
        console.log(
          'An error has occurred subscribing to user data in home component. Error: ',
          err,
        );
      },
    });
    console.log(this.userData, ' userData');
  }

  goToProfile(userId: string) {
    this.router.navigate(['/profile', userId]);
  }

  ngOnDestroy() {
    // Prevent memory leaks by unsubscribing manually
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
