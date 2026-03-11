import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'securepassword' })
    @IsString()
    @MinLength(6)
    password!: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    name!: string;

    @ApiProperty({ required: false, example: 'My Organization' })
    @IsOptional()
    @IsString()
    organizationName?: string;
}

export class LoginDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'securepassword' })
    @IsString()
    password!: string;
}

export class RefreshTokenDto {
    @ApiProperty()
    @IsString()
    refreshToken!: string;
}
