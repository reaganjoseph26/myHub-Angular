import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/UsersService';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../services/interfaces/user';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  userData:User = {} as User;

  ngOnInit(): void {
     this.userData = this.userService.userData()();
    // this.userService.getProfileData(`profile/${user.username}`).subscribe({
    //   next: (data) => {
    //     console.log('Data received in nav component successfully:', data);
    //   },
    //   error: (error) => {
    //     console.error(
    //       'Error fetching data from server in nav component:',
    //       error,
    //     );
    //   },
    // });
  }
}
