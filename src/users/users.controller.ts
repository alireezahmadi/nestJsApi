import { Controller, Get, Post, Patch, Delete, Body, Param  } from '@nestjs/common'; 
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto'; 
import { UpdateUserDto } from './dto/UpdateUser.dto'; 
import { HasRoles } from 'src/common/decerators/roles.decorator'; 
import { Role } from 'src/common/enums/roles.enum'; 
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { IsAdminOrOwnerGuard } from 'src/common/guards/isAdminOrOwner.guard'; 
import { ApiResponse, ApiBearerAuth, ApiTags, ApiParam  } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly userService: UsersService){}

    @HasRoles(Role.Admin)
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Post()
    @ApiResponse({
        status:400,
        description:'Bad Request'
    })
    @ApiResponse({
        status:201,
        type: CreateUserDto
    })
    create(@Body() createUserDto:CreateUserDto ){
       
        return this.userService.create({...createUserDto})
    }

    @HasRoles(Role.Admin)
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Get() 
 
    @ApiResponse({
        status:200,
        type: [CreateUserDto]
    })
    findAll(){
        return this.userService.findAll()
    }


    @UseGuards(AccessTokenGuard, IsAdminOrOwnerGuard)
    @Get(':email')
    @ApiResponse({
        status:200,
        type: CreateUserDto
    })
    @ApiResponse({
        status:400,
        description:'Bad Request'
    })
    @ApiParam({
        name: 'email',
        description: 'The email of the user',
    })
    findByEmail(@Param('email') email: string){
        return this.userService.findByEmail(email)
    } 

    @UseGuards(AccessTokenGuard, IsAdminOrOwnerGuard)
    @Patch(':email')
    @ApiResponse({
        status:200,
        type: CreateUserDto
    })
    @ApiResponse({
        status:400,
        description:'Bad Request'
    })
    @ApiParam({
        name: 'email',
        description: 'The email of the user',
    })
    update(@Param('email') email:string, @Body() updateUserDto:UpdateUserDto){

        return this.userService.update(email, updateUserDto)
    }

    @HasRoles(Role.Admin)
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Delete(':email')
    @ApiResponse({
        status:200,
        type: CreateUserDto
    })
    @ApiResponse({
        status:400,
        description:'Bad Request'
    })
    @ApiParam({
        name: 'email',
        description: 'The email of the user',
    })
    remove(@Param('email') email:string){
        return this.userService.remove(email)
    }

}
