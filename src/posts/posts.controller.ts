import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUserFromAuth } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Auth()
  @Post()
  create(@Body() createPostDto: CreatePostDto, @GetUserFromAuth() user: User) {
    return this.postsService.create(createPostDto, user);
  }

  @Auth()
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Auth()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.findOne(id);
  }

  @Auth()
  @Delete(':id')
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUserFromAuth('id') userId: string,
  ) {
    return this.postsService.delete(id, userId);
  }

  @Auth()
  @Post(':id/comments')
  commentAPost(
    @Body()
    createCommentDto: CreateCommentDto,
    @Param('id', ParseUUIDPipe)
    postId,
    @GetUserFromAuth()
    user: User,
  ) {
    return this.postsService.commentAPost(createCommentDto, postId, user);
  }

  @Auth()
  @Delete('comments/:id')
  deleteComment(
    @Param('id', ParseUUIDPipe)
    id: string,
    @GetUserFromAuth('id')
    userId: string,
  ) {
    return this.postsService.deleteComment(id, userId);
  }
}
