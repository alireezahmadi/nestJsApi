import { Injectable } from "@nestjs/common"; 
import { Strategy, ExtractJwt } from "passport-jwt"; 
import { PassportStrategy } from "@nestjs/passport"; 
import { Role } from "src/common/enums/roles.enum";


type JwtPayload = {
    sub: string, 
    email:string, 
    roles: Role[]
} 

@Injectable() 
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ACCESS_SECRET
        })

    }

    validate(payload:JwtPayload){
        return payload
    }
}