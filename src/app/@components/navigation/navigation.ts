import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/UsersService';
import { Subscription } from 'rxjs';
import { User } from '../../services/interfaces/user';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})
export class Navigation implements OnInit {
  userSub!: Subscription;
  userData!: User | null;
  username!: string | undefined;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    // this.route.paramMap.subscribe((params) => {
    //   this.username = params.get('username');
    // });
    console.log('nav is working');
    this.userSub = this.userService.userData$.subscribe({
      next: (data) => {
        this.userData = data;
        this.username = data?.username;
      },
      error: (err) => {
        console.log(
          'An error has occurred subscribing to user data in navigation component. Error: ',
          err,
        );
      },
    });
  }

  goToUser(user: string) {
    // Navigates to absolute path: /home/user/username
    this.router.navigate(['/home', 'user', user]);
  }

  ngOnDestroy() {
    // Prevent memory leaks by unsubscribing manually
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  // fetchData(): void {
  //   this.userService.getServerData().subscribe({
  //     next: (data) => {
  //       console.log('Data received successfully:', data);
  //     },
  //     error: (error) => {
  //       console.error('Error fetching data from server:', error);
  //     },
  //   });
  // }
}
