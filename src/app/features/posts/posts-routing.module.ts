import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './post-list/post-list.component';
import { PostFormComponent } from './post-form/post-form.component';
import { PostDetailComponent } from './post-detail/post-detail.component';

const routes: Routes = [
  { 
    path: '', 
    component: PostListComponent,
  },
  { 
    path: 'new', 
    component: PostFormComponent,
    data: { isEdit: false }
  },
  { 
    path: ':id', 
    component: PostDetailComponent 
  },
  { 
    path: ':id/edit', 
    component: PostFormComponent,
    data: { isEdit: true }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
