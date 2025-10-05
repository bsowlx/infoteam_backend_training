import { IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreatePostDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}
