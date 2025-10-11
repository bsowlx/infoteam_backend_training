import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreatePostDto {
    @ApiProperty({ example: 1, description: 'ID of the user creating the post' })
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty({ example: 'Post Title', description: 'Title of the post' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Post Content', description: 'Content of the post' })
    @IsString()
    @IsNotEmpty()
    content: string;
}
