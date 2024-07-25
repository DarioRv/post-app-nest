import { Comment } from '../../posts/entities/comment.entity';

export const convertToPublicComment = (comment: Comment) => {
  const publicComment = {
    body: comment.body,
    createdAt: comment.createdAt,
    postId: comment.post.id,
    userId: comment.user.id,
  };

  return publicComment;
};
