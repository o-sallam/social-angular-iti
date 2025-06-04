import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Comment } from '../models/comment.model';
import { CommentService } from '../services/comment.service';
import { AuthService } from '../../auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, of, EMPTY, map, forkJoin } from 'rxjs';
import { switchMap, takeUntil, tap, filter, shareReplay, catchError } from 'rxjs/operators';
import { Post } from '../models/post';
import { PostsService } from '../services/posts.service';
import { User } from '../../users/models/user.model';
import { UserService } from '../../users/services/user.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'], // Corrected to styleUrls
})
export class PostDetailComponent implements OnInit, OnDestroy {
  comments$!: Observable<Comment[]>; // New property for comments
  isLoggedIn$: Observable<boolean>; // To control comment box visibility
  // @Input() post!: Post; // Removed: data will be fetched based on route params
  @Output() sendCardTitle = new EventEmitter<string>(); // Kept as per previous context

  post$!: Observable<Post | undefined>;
  user$!: Observable<User | undefined>;
  comment: string = '';

  private postId: number | undefined;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostsService,
    private userService: UserService,
    private commentService: CommentService, // Injected CommentService
    private authService: AuthService // Injected AuthService
  ) {
    this.isLoggedIn$ = this.authService.currentUser.pipe(map(user => !!user)); // Initialize isLoggedIn$
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.postId = +id;
          this.loadPostAndUser(this.postId);
          this.loadComments(this.postId); // Load comments
          return of(this.postId); // Continue the stream if needed
        } else {
          this.router.navigate(['/posts']); // Or a 'not-found' page
          return EMPTY; // Complete the observable stream if no ID
        }
      })
    ).subscribe();
  }

  loadPostAndUser(postId: number): void {
    this.post$ = this.postService.getPost(postId).pipe(
      tap(post => {
        if (!post) {
          this.router.navigate(['/not-found']);
        }
      }),
      shareReplay(1) // Cache the last emitted value and replay for new subscribers
    );

    this.user$ = this.post$.pipe(
      filter((post): post is Post => !!post), // Ensure post is not undefined/null
      switchMap(post => {
        if (post.userId) {
          return this.userService.getUser(post.userId);
        }
        return of(undefined); // No user if no userId on post
      }),
      shareReplay(1)
    );
  }

  // New method to load comments, now with explicit user fetching
  loadComments(postId: number): void {
    this.comments$ = this.commentService.getCommentsByPostId(postId).pipe(
      switchMap(comments => {
        if (!comments || comments.length === 0) {
          return of([]); // Return an observable of an empty array if no comments
        }
        // Create an array of observables, each fetching a user for a comment
        const commentsWithUsers$: Observable<Comment>[] = comments.map(comment => {
          // Ensure userId is treated as a number for userService.getUser
          const userId = typeof comment.userId === 'string' ? parseInt(comment.userId, 10) : comment.userId;
          if (userId && !isNaN(userId)) {
            return this.userService.getUser(userId as number).pipe(
              map(user => ({
                ...comment,
                user: user // Embed the fetched user into the comment
              })),
              catchError(() => {
                // If user fetch fails, return comment with user as undefined
                return of({ ...comment, user: undefined });
              })
            );
          } else {
            // If no valid userId, return the comment as is with user undefined
            return of({ ...comment, user: undefined });
          }
        });
        return forkJoin(commentsWithUsers$); // Wait for all user fetches to complete
      }),
      shareReplay(1) // Cache and replay the combined result
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // currentPost is passed from the template: (post$ | async) as post
  addComment(): void { // Removed currentPost parameter as postId is available
    if (this.comment.trim() && this.postId) {
      this.commentService.addComment(this.postId, this.comment).pipe(
        takeUntil(this.destroy$),
        // After adding, refresh the comments list
        switchMap(() => {
          this.loadComments(this.postId!); // Reload comments
          return of(null); // complete the inner observable
        })
      ).subscribe(() => {
        this.comment = ''; // Clear the comment input box
      });
    }
  }

  onCommentInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.comment = textarea.value;
  }

  onEdit(currentPost: Post): void { 
    if (currentPost) {
      this.router.navigate(['/posts', currentPost.id, 'edit']);
    }
  }

  onDelete(currentPost: Post): void { 
    if (currentPost && this.postId && confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(currentPost.id).pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.router.navigate(['/posts']);
      });
    }
  }

  toggleLike(currentPost: Post): void { 
    if (currentPost && this.postId) {
      const updatedPostData = { ...currentPost, isLiked: !currentPost.isLiked };
      this.postService.updatePost(currentPost.id, updatedPostData).pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.loadPostAndUser(this.postId!); // Refresh post and user data
      });
    }
  }
}

