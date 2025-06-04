import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../../users/models/user.model'; // Adjust path as needed
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(email: string, password?: string): Observable<User> { // Made password optional for now
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(u => u.email === email);
        if (user) {
          // In a real app, you would verify the password here.
          // For json-server, we'll assume if email matches, login is successful.
          // You could extend this to check a plain text password if added to db.json
          console.log('User found:', user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        } else {
          console.log('User not found or invalid credentials');
          throw new Error('Invalid email or password');
        }
      })
      // catchError can be added here to handle HTTP errors from the get request itself
    );
  }

  // Placeholder for logout
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    // Navigation to login can be handled by the component or an AuthGuard
  }

  // Placeholder to check if user is logged in
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Placeholder to get current user
  getCurrentUser(): User | null { // This can be replaced by currentUserValue or subscribing to currentUser
    return this.currentUserSubject.value;
  }

  register(user: User): Observable<User> {
    // json-server will automatically assign an id
    // Ensure the user object being sent matches what your User model expects
    // and what json-server can handle (e.g., no client-side only fields unless intended)
    return this.http.post<User>(this.apiUrl, user).pipe(
      tap((newUser) => {
        console.log('User registered successfully on server:', newUser);
        // Optionally, log the user in directly after registration
        // localStorage.setItem('currentUser', JSON.stringify(newUser));
        // this.currentUserSubject.next(newUser);
      })
    );
  }
}
