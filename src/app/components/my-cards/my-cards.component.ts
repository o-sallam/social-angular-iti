import { Component, inject } from '@angular/core';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-my-cards',
  templateUrl: './my-cards.component.html',
  styleUrl: './my-cards.component.css',
})
export class MyCardsComponent {
  postService = inject(PostsService);
}
