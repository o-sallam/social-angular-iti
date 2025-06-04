import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { PostsService } from '../services/posts.service';
import { PostWithUser } from '../models/post';
import { User } from '../../users/models/user.model';
import { UserService } from '../../users/services/user.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  posts$!: Observable<PostWithUser[]>; // Changed to an Observable

  constructor(
    private postService: PostsService, // Changed to private as it's used internally
    private userService: UserService
  ) {}

  getUserById(userId: number): Observable<User | undefined> {
    return this.userService.getUser(userId);
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.posts$ = this.postService.getPostsWithUser().pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleLike(post: PostWithUser): void {
    const updatedPost = { ...post, isLiked: !post.isLiked };
    this.postService
      .updatePost(post.id, updatedPost)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          // Option 1: Optimistically update the UI if posts$ emits the array directly
          // This requires posts$ to be a BehaviorSubject or similar if we want to push updates.
          // For simplicity with async pipe, we might need to re-fetch or update the specific item.
          // Option 2: Re-fetch posts to reflect the change (simpler with async pipe)
          this.loadPosts();
          // console.log('Post like updated successfully');
        })
      )
      .subscribe({
        // error: (err) => console.error('Error updating post like:', err) // Optional: Add error handling
      });
  }

  // TrackBy function to improve ngFor performance
  trackByPostId(index: number, post: PostWithUser): number {
    return post.id;
  }

  // Add this method to handle the card click if needed
  onCardClick(title: string): void {
    console.log('Card clicked:', title);
  }
}
