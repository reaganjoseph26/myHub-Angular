import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/UsersService';
import { ActivatedRoute, Router } from '@angular/router';

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

  username: string | null = null;

  ngOnInit(): void {
    console.log('profile');

    this.route.paramMap.subscribe((params) => {
      this.username = params.get('username');
    });

    const user = {
      username: 'testuser',
      firstname: 'Test',
      lastname: 'User',
      email: 'testuser@test.com',
    };
    // });
    this.userService.getProfileData(`profile/${user.username}`).subscribe({
      next: (data) => {
        console.log('Data received in nav component successfully:', data);
      },
      error: (error) => {
        console.error(
          'Error fetching data from server in nav component:',
          error,
        );
      },
    });
  }
}
