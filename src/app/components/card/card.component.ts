import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Post } from '../../models/post';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() post!: Post;
  @Output() sendCardTitle = new EventEmitter<string>();
  postService = inject(PostsService);

  id: number = 0;
  comment: string = '';

  addComment() {
    this.postService.addComment(this.id, this.comment);
    this.comment = '';
  }

  commentInput(event: Event, postId: number) {
    const textarea = event.target as HTMLTextAreaElement;

    this.id = postId;
    this.comment = textarea.value;
  }
}
