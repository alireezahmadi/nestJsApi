import { Controller, Post, Get, Body, Req, HttpCode  } from '@nestjs/common';
import { Request } from 'express';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';
import { AuthDto } from './dto/Auth.dto';
import { TokenDto } from './dto/Tokens.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { ApiResponse, ApiTags, ApiBody  } from '@nestjs/swagger';


@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    
    @Post('signup')
    @ApiResponse({
        status:201,
        type:TokenDto
    })
    @ApiResponse({
        status:400,
        description:'Bad Request'
    })
    @ApiBody({ type: CreateUserDto })
    signup(@Body() createUserDto:CreateUserDto){
        return this.authService.signUp(createUserDto)
    }

    @Post('/signin')
    @HttpCode(200)
    @ApiResponse({
        status:200,
        type:TokenDto
    })
    @ApiResponse({
        status:400,
        description:'Bad Request'
    })
   
    signin(@Body() data:AuthDto){
        return this.authService.signIn(data)
    }

    @UseGuards(AccessTokenGuard)
    @Get('logout') 
    @HttpCode(204)
    logout(@Req() req:Request){
        return this.authService.logout(req.user['sub'])
    }

  
  

        


}
