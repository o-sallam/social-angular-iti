import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, of, throwError } from 'rxjs';
import { Comment } from '../models/comment.model';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/comments`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getCommentsByPostId(postId: string | number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}?postId=${postId}&_expand=user&_sort=createdAt&_order=desc`);
  }

  addComment(postId: string | number, text: string): Observable<Comment> {
    return this.authService.currentUser.pipe(
      switchMap(user => {
        if (!user || !user.id) {
          return throwError(() => new Error('User not logged in or user ID is missing'));
        }
        const newComment: Partial<Comment> = {
          postId: postId,
          userId: user.id,
          text: text,
          createdAt: new Date().toISOString()
        };
        return this.http.post<Comment>(this.apiUrl, newComment);
      })
    );
  }
}
