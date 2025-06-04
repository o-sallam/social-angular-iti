export interface Post {
  id: number;
  userName: string;
  userImage: string;
  postDescription: string;
  postImage: string;
  isLiked: boolean;
  comments: string[];
}
