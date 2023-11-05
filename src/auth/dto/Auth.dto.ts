import {IsEmail, IsNotEmpty} from 'class-validator' 
import { ApiProperty } from '@nestjs/swagger';
export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        description:'the E-mail of the User'
    })
    email:string;
    @IsNotEmpty()
    @ApiProperty({
        description:'the password of the User'
    })
    password:string
}