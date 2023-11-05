import { Injectable, ExecutionContext, CanActivate, ForbiddenException } from "@nestjs/common";
import { UsersService } from "src/users/users.service"; 


@Injectable() 
export class IsAdminOrOwnerGuard implements CanActivate{
    constructor(private readonly userService:UsersService){} 
     async canActivate(context: ExecutionContext): Promise<boolean>{
        try{
            const {user, params} = context.switchToHttp().getRequest() 

            if(!params) throw new ForbiddenException()
            const userFound =await this.userService.findByEmail(params.email)
            const result:boolean = user?.roles?.includes('admin') || userFound.id == user.sub 
            return result
        }
        catch(err){
            throw new ForbiddenException()
        }
    }
}