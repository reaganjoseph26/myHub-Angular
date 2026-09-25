import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/UsersService';
import { Post } from '../../services/interfaces/post';

@Component({
  selector: 'app-hub',
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './hub.html',
  styleUrl: './hub.css',
})
export class Hub implements OnInit {
  private fb = inject(FormBuilder);
  // private authservice = inject(AuthService);
  private userservice = inject(UserService);
  // private router = inject(Router);

  isSubmitting: Boolean = false;
  errMsg: string = '';
  isChecked: Boolean = false;
  showPwd: Boolean = false;
  hubForm = this.fb.nonNullable.group({
    post: ['', Validators.required],
  });
  userPosts: Post[] = [];
  hubbiesPosts: Post[] = [];

  ngOnInit() {
    this.getUserPosts();
  }

  getUserPosts() {
    this.userservice.getUserPosts().subscribe({
      next: (res) => {
        this.userPosts = res;
        console.log(this.userPosts);
        this.errMsg = '';
      },
      error: (err) => {
        console.log('An error has occurred getting user posts. Error: ', err);
        this.errMsg = 'Error fetching your posts';
      },
    });
  }

  replyToPost() {
    console.log('replying to post');
  }

  removePost(index: number) {
    console.log('remove post index: ', index);
  }

  submitHubForm() {
    this.isSubmitting = true;
    const postObj = this.hubForm.getRawValue();

    this.userservice
      .createPost(postObj.post)
      .pipe(finalize(() => ((this.isSubmitting = false), this.getUserPosts())))
      .subscribe({
        next: (res) => {
          this.hubForm.controls.post.reset();
          this.errMsg = '';
        },
        error: (err) => {
          console.log('An error has occurred creating post. Error: ', err);
          this.errMsg = 'Error creating your post.Please try again.';
        },
      });
  }
}
