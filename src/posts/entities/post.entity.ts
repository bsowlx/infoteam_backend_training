import { ApiProperty } from '@nestjs/swagger';

export class Post {
  @ApiProperty({ example: 1, description: 'Post ID' })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the user who created the post',
  })
  userId: number;

  @ApiProperty({ example: 'My First Post', description: 'Post title' })
  title: string;

  @ApiProperty({
    example: 'This is the content of the post',
    description: 'Post content',
  })
  content: string;
}
