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
  show_socials: boolean = true;
  show_achievements: boolean = true;
  show_followers: boolean = true;
  show_location: boolean = true;

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
    this.show_socials = this.data['userData'].user_setting.show_socials;
    this.show_achievements = this.data['userData'].user_setting.show_achievements;
    this.show_followers= this.data['userData'].user_setting.show_followers;
    this.show_location = this.data['userData'].user_setting.show_location;
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

  // bind individual textarea's to the signal record
  onTextChange(postId: string, text: string) {
    this.replyTexts.update((prev) => ({ ...prev, [postId]: text }));
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
    const text = this.replyTexts()[postId] || '';
    const postObj = { post: text, replyToId: postId };

    this.userservice
      .createPost(postObj.post, postObj.replyToId)
      .pipe(
        finalize(() => this.getHubbiesPosts(this.data['userData'].following)),
      )
      .subscribe({
        next: (res) => {
          //console.log(res, ' res'),
          // Clear text and close the box for this specific post
          ((this.replyTexts.update((prev) => ({ ...prev, [postId]: '' })),
          this.openReplies.update((prev) => ({
            ...prev,
            [postId]: false,
          }))),
            (this.errMsg = ''));
        },
        error: (err) => {
          console.log(
            'An error has occurred with your reply to post. Error: ',
            err,
          );
          this.errMsg = 'Error replying to post.Please try again.';
        },
      });
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
