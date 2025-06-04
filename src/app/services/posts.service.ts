import { Injectable } from '@angular/core';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private _posts: Post[] = [
    {
      id: 1,
      userName: 'Ahmed Khaled',
      userImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      postDescription: 'Enjoying the sunset at the beach 🌅',
      postImage:
        'https://imgs.search.brave.com/VHaL8qHP-KjWtDPxWni6Zk9jyWeOcZiw-19R9W-HZ0c/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvZGlm/ZmVyZW50LXRvbWF0/by1mcnVpdHMtb3V0/ZG9vci1waG90b3No/b290LXE0azYwcnBo/bXRuZjdldzQuanBn',
      isLiked: false,
      comments: [],
    },
    {
      id: 2,
      userName: 'Fatma Hassan',
      userImage: 'https://randomuser.me/api/portraits/women/45.jpg',
      postDescription: 'Had an amazing coffee this morning ☕',
      postImage:
        'https://imgs.search.brave.com/2UgW7QUYniVuMfiSOPLJUllk-WMipsfTpTkZe86rDtM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvZmVhdHVy/ZWQvZGVza3RvcC1s/c2prcjZ3ZzdjdHE5/N3F2LmpwZw',
      isLiked: true,
      comments: [],
    },
    {
      id: 3,
      userName: 'Mohamed Adel',
      userImage: 'https://randomuser.me/api/portraits/men/12.jpg',
      postDescription: 'Working hard or hardly working? 😅',
      postImage:
        'https://imgs.search.brave.com/GeweRwBKOVP8aP3iPPu0juFS4CVJ8fHoi77-baMS9gE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAyLzY3LzU2Lzgw/LzM2MF9GXzI2NzU2/ODA1MF9nS2tjQkFJ/NVhrcEVITnBpcGt4/MmFJYXJOYndhckNS/Ti5qcGc',
      isLiked: false,
      comments: [],
    },
    {
      id: 4,
      userName: 'Sara Youssef',
      userImage: 'https://randomuser.me/api/portraits/women/67.jpg',
      postDescription: 'Nature is the best therapy 🍃',
      postImage:
        'https://imgs.search.brave.com/6b4tGb-ISHucgim_sz0dfpvEOltQ6SwwBEoIB0E6BOs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNC8w/Ny8wNi8xMy81NS9j/YWxjdWxhdG9yLTM4/NTUwNl82NDAuanBn',
      isLiked: true,
      comments: [],
    },
    {
      id: 5,
      userName: 'Omar Salah',
      userImage: 'https://randomuser.me/api/portraits/men/54.jpg',
      postDescription: 'Code, eat, sleep, repeat 💻',
      postImage:
        'https://imgs.search.brave.com/zZmZc8AC-qYPCpMCHsbjy0jBw6QHTb2H3C51KTjv8Gg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdG9y/eWJsb2stY2RuLnBo/b3Rvcm9vbS5jb20v/Zi8xOTE1NzYvNzY4/eDQzMi82NDgwYmJm/Y2ZjL2FkZF9iYWNr/Z3JvdW5kX2NhcmQu/d2VicA',
      isLiked: false,
      comments: [],
    },
  ];

  get posts(): Post[] {
    return this._posts;
  }

  addPost(post: Post) {
    this._posts.push(post);
  }

  deletePost(postId: number) {
    this._posts = this._posts.filter((post) => post.id != postId);
  }

  addComment(postId: number, comment: string) {
    this._posts.find((post) => post.id === postId)?.comments.push(comment);
  }
}
