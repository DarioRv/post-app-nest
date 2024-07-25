import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import {
  convertToPublicPost,
  convertToPublicPostWithComments,
} from '../common/mappers/post.mapper';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { convertToPublicComment } from 'src/common/mappers/comment.mapper';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User) {
    try {
      const post = await this.postRepository.create({
        ...createPostDto,
        author: user,
      });
      await this.postRepository.save(post);
      return convertToPublicPost(post);
    } catch (err) {
      this.handleDbErrors(err);
    }
  }

  async delete(id: string, userId: string) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post || !post.isActive)
      throw new NotFoundException(`Post with id '${id}' not found`);

    if (post.author.id != userId)
      throw new ForbiddenException('You are not the owner of this resource');

    try {
      await this.postRepository.update({ id }, { ...post, isActive: false });
    } catch (err) {
      this.handleDbErrors(err);
    }
  }

  async findOne(id: string) {
    const post = await this.postRepository.findOneBy({ id });

    if (!post || !post.isActive)
      throw new NotFoundException(`Post with id '${id}' not found`);

    return convertToPublicPostWithComments(post);
  }

  async findAll() {
    try {
      const posts = await this.postRepository.find({
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          body: true,
          createdAt: true,
        },
        relations: {
          comments: true,
          author: true,
        },
      });

      const publicPosts = posts.map((p) => {
        return convertToPublicPostWithComments(p);
      });

      return publicPosts;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async commentAPost(
    createCommentDto: CreateCommentDto,
    postId: string,
    user: User,
  ) {
    const post = await this.postRepository.findOneBy({
      id: postId,
    });
    if (!post)
      throw new NotFoundException(`Post with id '${postId}' does not exists`);

    try {
      const comment = await this.commentRepository.create({
        ...createCommentDto,
        user,
        post,
      });

      await this.commentRepository.save(comment);
      return convertToPublicComment(comment);
    } catch (err) {
      this.handleDbErrors(err);
    }
  }

  async deleteComment(id: string, userId: string) {
    const comment = await this.commentRepository.findOneBy({ id });
    if (!comment || !comment.isActive)
      throw new NotFoundException(`Comment with id '${id}' not found`);

    if (comment.user.id != userId)
      throw new ForbiddenException('You are not the owner of this resource');

    try {
      await this.commentRepository.update(
        { id },
        { ...comment, isActive: false },
      );
    } catch (err) {
      this.handleDbErrors(err);
    }
  }

  private handleDbErrors(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    throw new InternalServerErrorException('Unexpected error');
  }
}
