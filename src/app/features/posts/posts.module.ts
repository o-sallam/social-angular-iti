import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostListComponent } from './post-list/post-list.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostFormComponent } from './post-form/post-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostsRoutingModule } from './posts-routing.module';

@NgModule({
  declarations: [PostListComponent, PostDetailComponent, PostFormComponent],
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    PostsRoutingModule
  ],
  exports: [PostListComponent, PostDetailComponent, PostFormComponent],
})
export class PostsModule {}
