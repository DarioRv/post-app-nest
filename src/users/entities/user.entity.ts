import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from '../../posts/entities/comment.entity';
import { Post } from '../../posts/entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Username to identify the user',
    example: 'john_doe',
    uniqueItems: true,
  })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  @Column()
  fullName: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'johndoe@email.com',
    uniqueItems: true,
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Password to sign in', example: 'DoeJohn1234@' })
  @Column()
  password: string;

  @ApiProperty({
    description: 'Role of the user',
    example: 'user',
    default: 'user',
  })
  @Column({ default: 'user' })
  role: string;

  @ApiProperty({
    description: 'Status of the user',
    example: true,
    default: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
