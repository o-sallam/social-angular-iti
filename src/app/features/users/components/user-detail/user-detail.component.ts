import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: User | undefined;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getUser(+id);
    }
  }

  getUser(id: number): void {
    this.userService.getUser(id).subscribe({
      next: (user) => this.user = user,
      error: (err) => console.error('Error loading user', err)
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
