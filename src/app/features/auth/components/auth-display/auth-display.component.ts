import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../../users/models/user.model';

@Component({
  selector: 'app-auth-display',
  templateUrl: './auth-display.component.html',
  styleUrls: ['./auth-display.component.css'],
})
export class AuthDisplayComponent implements OnInit {
  currentUser$: Observable<User | null>;
  defaultAvatarUrl = 'assets/user-default.webp'; // Default user avatar

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser$ = this.authService.currentUser;
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
