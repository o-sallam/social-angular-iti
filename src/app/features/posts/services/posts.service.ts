import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap, forkJoin, map, of } from 'rxjs';
import { Post, PostWithUser } from '../models/post';
import { UserService } from '../../users/services/user.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private apiUrl = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient, private userService: UserService) {}

  // GET all posts
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  // GET a single post by ID
  getPost(id: number): Observable<Post | undefined> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  // POST a new post
  // The server will generate the id and createdAt for new posts
  addPost(
    postData: Omit<Post, 'id' | 'createdAt' | 'comments' | 'isLiked'> & {
      userId: number;
      postDescription: string;
      postImage: string;
    }
  ): Observable<Post> {
    const newPost: Omit<Post, 'id' | 'createdAt'> = {
      ...postData,
      isLiked: false,
      comments: [],
    };
    return this.http.post<Post>(this.apiUrl, newPost);
  }

  // PUT (update) an existing post
  updatePost(id: number, updatedPost: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, updatedPost);
  }

  // DELETE a post by ID
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Add a comment to a post
  addComment(postId: number, commentText: string): Observable<Post> {
    return this.getPost(postId).pipe(
      switchMap((post) => {
        if (!post) {
          throw new Error(`Post with id ${postId} not found`);
        }
        // Ensure comments array exists
        const updatedComments = post.comments ? [...post.comments] : [];
        updatedComments.push(commentText);

        const updatedPost: Post = {
          ...post,
          comments: updatedComments,
        };
        return this.updatePost(postId, updatedPost);
      })
    );
  }

  // GET all posts with their user data
  getPostsWithUser(): Observable<PostWithUser[]> {
    return this.getPosts().pipe(
      switchMap((posts: Post[]) => {
        if (!posts || posts.length === 0) {
          return of([]); // Return an empty array if there are no posts
        }
        // Create an array of Observables, each fetching a user for a post
        const userObservables: Observable<PostWithUser>[] = posts.map(post => {
          return this.userService.getUser(post.userId).pipe(
            map(user => {
              // Combine post with user data, explicitly cast to PostWithUser
              return { ...post, user: user } as PostWithUser;
            })
          );
        });
        // Use forkJoin to wait for all user Observables to complete
        return forkJoin(userObservables);
      })
    );
  }
}
