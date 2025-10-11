import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString} from "class-validator";

export class CreatePostDto {
    @ApiProperty({ example: 'Post Title', description: 'Title of the post' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Post Content', description: 'Content of the post' })
    @IsString()
    @IsNotEmpty()
    content: string;
}
