import { User } from '../../users/models/user.model';

export interface Comment {
  id: string | number;
  postId: string | number;
  userId: string | number;
  text: string;
  createdAt: string;
  user?: User;
}
