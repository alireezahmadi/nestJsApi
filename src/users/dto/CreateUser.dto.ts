import { Role } from "src/common/enums/roles.enum";
import { IsEmail, IsNotEmpty ,IsIn, IsString, IsOptional, MinLength, MaxLength} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'; 

export class CreateUserDto {
    @IsNotEmpty() 
    @IsEmail()
    @ApiProperty({
        description:'the E-mail of the User', 
        example:'test@test.com'
    })
    email:string;
    @IsNotEmpty() 
    @MinLength(4)
    @MaxLength(12)
    @ApiProperty({
        description:'the password of the User', 
        minLength:4, 
        maxLength:12
    })
    password:string;
    @IsString()
    @IsOptional()
    refreshToken:string;
    
    @IsIn([Role.Admin, Role.User])
    @ApiProperty({
        description:'roles must be one of the following values: admin, user', 
        enum: ['admin', 'user'], 
        default:'user'
    })
    roles: Role[]
}