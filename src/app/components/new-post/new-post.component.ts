import { Component, inject } from '@angular/core';
import { Post } from '../../models/post';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css',
})
export class NewPostComponent {
  postsService = inject(PostsService);
  postForm!: FormGroup;

  ngOnInit(): void {
    this.postForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      userImage: new FormControl('', [Validators.required]),
      postImage: new FormControl('', [Validators.required]),
      postDescription: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const newPost: Post = {
      ...this.postForm.value,
      isLiked: false,
      comments: [],
    };

    this.postsService.addPost(newPost);
  }
}
