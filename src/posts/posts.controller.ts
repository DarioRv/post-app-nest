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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Missing or expired token' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Auth()
  @Post()
  create(@Body() createPostDto: CreatePostDto, @GetUserFromAuth() user: User) {
    return this.postsService.create(createPostDto, user);
  }

  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Missing or expired token' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Auth()
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Missing or expired token' })
  @ApiResponse({ status: 404, description: 'Post with id not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Auth()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.findOne(id);
  }

  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 401, description: 'Missing or expired token' })
  @ApiResponse({
    status: 403,
    description: 'You are not the owner of this resource',
  })
  @ApiResponse({ status: 404, description: 'Post with id not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Auth()
  @Delete(':id')
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUserFromAuth('id') userId: string,
  ) {
    return this.postsService.delete(id, userId);
  }

  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 401, description: 'Missing or expired token' })
  @ApiResponse({ status: 404, description: 'Post with id not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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

  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 401, description: 'Missing or expired token' })
  @ApiResponse({
    status: 403,
    description: 'You are not the owner of this resource',
  })
  @ApiResponse({ status: 404, description: 'Comment with id not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
