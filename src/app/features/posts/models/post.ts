import { User } from '../../users/models/user.model';

export interface PostWithUser extends Post {
  user?: User;
}

export interface Post {
  id: number;
  userId: number;
  postDescription: string;
  postImage: string;
  isLiked: boolean;
  comments: string[];
  createdAt?: Date;
}
