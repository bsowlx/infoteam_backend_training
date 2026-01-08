import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreatePostDto {
    @ApiProperty({ example: 'b3b8d3d8-8f2f-4d68-8d14-1c8e0d3c5caa', description: 'Category ID (UUID)' })
    @IsUUID()
    @IsNotEmpty()
    categoryId: string;

    @ApiProperty({ example: 'Post Title', description: 'Title of the post' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Post Content', description: 'Content of the post' })
    @IsString()
    @IsNotEmpty()
    content: string;
}
