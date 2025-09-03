import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @ApiProperty({ description: 'Email del usuario', example: 'john.doe@example.com' })
    readonly email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @ApiProperty({ description: 'Contraseña del usuario', example: 'password123' })
    readonly password: string;

    @IsString()
    @ApiProperty({ description: 'Nombre del usuario', example: 'John Doe' })
    readonly name: string;
}
