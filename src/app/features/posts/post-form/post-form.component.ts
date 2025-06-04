import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, switchMap, of } from 'rxjs';
import { PostsService } from '../services/posts.service';
// UserService might not be directly needed here unless for currentUserId logic in a real app
// import { UserService } from '../../users/services/user.service'; 
import { Post } from '../models/post';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css'], // Corrected to styleUrls
})
export class PostFormComponent implements OnInit, OnDestroy {
  postForm: FormGroup;
  isEditMode = false;
  private postId: number | null = null;
  currentUserId: number = 1; // In a real app, this would come from an auth service
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private postService: PostsService,
    // private userService: UserService, // Potentially remove if not used for currentUserId
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      postDescription: ['', [Validators.required, Validators.minLength(3)]],
      postImage: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.isEditMode = true;
          this.postId = +id;
          return this.postService.getPost(this.postId);
        }
        this.isEditMode = false;
        this.postId = null;
        return of(null); // Not in edit mode, return null observable
      })
    ).subscribe(post => {
      if (this.isEditMode && post) {
        this.postForm.patchValue({
          postDescription: post.postDescription,
          postImage: post.postImage,
        });
      } else if (this.isEditMode && !post) {
        // Post not found in edit mode, navigate away or show error
        this.router.navigate(['/posts']); // Or a 'not-found' page
      }
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      return;
    }

    const formValue = this.postForm.value;

    if (this.isEditMode && this.postId) {
      // Fetch the existing post to preserve likes and comments
      this.postService.getPost(this.postId).pipe(
        takeUntil(this.destroy$),
        switchMap(existingPost => {
          if (!existingPost) {
            // Should not happen if ngOnInit loaded correctly, but as a safeguard
            this.router.navigate(['/posts']);
            return of(null);
          }
          const updatedPost: Post = {
            ...existingPost, // Spread existing post to keep id, userId, comments, isLiked, createdAt
            postDescription: formValue.postDescription,
            postImage: formValue.postImage,
            userId: existingPost.userId, // Or this.currentUserId if you allow changing user on edit
          };
          return this.postService.updatePost(this.postId!, updatedPost);
        })
      ).subscribe(updatedPost => {
        if (updatedPost) {
          this.router.navigate(['/posts', this.postId]); // Navigate to post detail
        }
      });
    } else {
      // Add new post
      const newPostData: Omit<Post, 'id' | 'createdAt' | 'comments' | 'isLiked'> & { userId: number; postDescription: string; postImage: string } = {
        userId: this.currentUserId,
        postDescription: formValue.postDescription,
        postImage: formValue.postImage,
      };
      this.postService.addPost(newPostData).pipe(
        takeUntil(this.destroy$)
      ).subscribe(createdPost => {
        this.router.navigate(['/posts', createdPost.id]); // Navigate to new post detail
      });
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.postId) {
      this.router.navigate(['/posts', this.postId]);
    } else {
      this.router.navigate(['/posts']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
