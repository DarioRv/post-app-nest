import { Post } from '../../posts/entities/post.entity';

export const convertToPublicPost = (post: Post) => {
  const publicPost = {
    id: post.id,
    title: post.title,
    body: post.body,
    createdAt: post.createdAt,
    isActive: post.isActive,
    authorId: post.author.id,
  };

  return publicPost;
};

export const convertToPublicPostWithComments = (post: Post) => {
  return {
    id: post.id,
    title: post.title,
    body: post.body,
    createdAt: post.createdAt,
    author: {
      id: post.author.id,
      fullName: post.author.fullName,
    },
    comments: post.comments.map((c) => {
      return {
        user: {
          id: c.user.id,
          fullName: c.user.fullName,
        },
        body: c.body,
        createdAt: c.createdAt,
      };
    }),
  };
};
