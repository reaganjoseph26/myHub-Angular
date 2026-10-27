import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/UsersService';
import { Post } from '../../services/interfaces/post';
import { User, UserProfile } from '../../services/interfaces/user';

@Component({
  selector: 'app-hub',
  imports: [ReactiveFormsModule, MatIconModule, FormsModule],
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
    post: [
      '',
      [Validators.required, Validators.maxLength(525), Validators.minLength(1)],
    ],
  });
  userPosts: Post[] = [];
  hubbiesPosts: Post[] = [];
  userData: User = {} as User;
  followers: number = 0;
  following: number = 0;
  data = inject(ActivatedRoute).snapshot.data;
  showReplies = signal<boolean>(false);
  openReplies = signal<Record<string, boolean>>({});
  replyTexts = signal<Record<string, string>>({});

  // constructor() {
  //   effect(() => {
  //     this.userData = this.userservice.userData();
  //     this.followers = this.userservice.userFollowerCount();
  //     this.following = this.userservice.userFollowingCount();
  //     console.log(this.userData, ' this.displayData()');
  //   });
  // }

  ngOnInit() {
    console.log(this.data, 'Hub component initialized');
    this.userData = this.data['userData'];
    this.followers = this.data['userData'].followers.length;
    this.following = this.data['userData'].following.length;
    this.getUserPosts();
  }

  getUserPosts(): void {
    this.userservice
      .getUserPosts()
      .pipe(
        finalize(() => this.getHubbiesPosts(this.data['userData'].following)),
      )
      .subscribe({
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

  getHubbiesPosts(hubbies: string[]): void {
    this.userservice.getHubbiesPosts(hubbies).subscribe({
      next: (res) => {
        this.hubbiesPosts = res;

        console.log(this.hubbiesPosts, 'this.hubbiesPosts');

        this.errMsg = '';
      },
      error: (err) => {
        console.log(
          'An error has occurred getting hubbies posts. Error: ',
          err,
        );
        this.errMsg = 'Error fetching hubbies posts';
      },
    });
  }

  toggleReplies(): void {
    this.showReplies.update((visible) => !visible);
  }

  replyToPost(postId: string) {
    console.log(postId, ' replying to post');
  }

  toggleReply(postId: string) {
    this.openReplies.update((prev) => {
      const isOpen = !prev[postId];

      // If we are opening the reply box for the first time, initialize its unique text state
      if (isOpen && this.replyTexts()[postId] === undefined) {
        this.replyTexts.update((texts) => ({ ...texts, [postId]: '' }));
      }

      return { ...prev, [postId]: isOpen };
    });
  }

  // Helper method to bind individual textareas to the signal record
  onTextChange(postId: string, text: string) {
    console.log(postId, ' onTextChange');
    console.log(text, ' onTextChange');
    this.replyTexts.update((prev) => ({ ...prev, [postId]: text }));

    console.log(this.replyTexts(), ' hehe ababy')
  }

  removePost(index: number): void {
    const postToRemove = this.userPosts[index];

    this.userservice
      .deletePost(postToRemove.id)
      .pipe(finalize(() => this.getUserPosts()))
      .subscribe({
        next: (res) => {
          this.hubForm.controls.post.reset();
          this.errMsg = '';
        },
        error: (err) => {
          console.log('An error has occurred deleting post. Error: ', err);
          this.errMsg = 'Error deleting your post.Please try again.';
        },
      });
  }

  submitReply(postId: string) {
    // const text = this.replyTexts()[postId] || '';
    // console.log(`Submitting unique reply for post ${postId}:`, text);
    //grab current any replied data 
    const repliesData = this.replyTexts();
    console.log(repliesData)

    // Add your backend/Sequelize submission logic here...

    // Clear text and close the box for this specific post
    this.replyTexts.update((prev) => ({ ...prev, [postId]: '' }));
    this.openReplies.update((prev) => ({ ...prev, [postId]: false }));

  
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
