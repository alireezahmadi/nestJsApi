import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"; 
import { Reflector } from "@nestjs/core";
import { Role } from "src/common/enums/roles.enum";
import { ROLES_KEY } from "../decerators/roles.decorator";

@Injectable() 
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){} 

    canActivate(context: ExecutionContext): boolean{
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(), 
            context.getClass()
        ]) 
        if(!requiredRoles) return true 

        const {user} = context.switchToHttp().getRequest() 
        const result = requiredRoles
                        .map(role => user?.roles?.includes(role))
                        .find(val => val == true)

     
        return result
        
    }
}