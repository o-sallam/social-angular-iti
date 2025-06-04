import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // GET all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // GET a single user by ID
  getUser(id: number): Observable<User | undefined> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
  
  // GET a user by username (json-server supports filtering via query params)
  getUserByUsername(username: string): Observable<User | undefined> {
    return this.http.get<User[]>(`${this.apiUrl}?username=${username}`).pipe(
      map(users => users && users.length > 0 ? users[0] : undefined)
    );
  }

  // POST a new user
  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // PUT (update) an existing user
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // DELETE a user by ID
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

