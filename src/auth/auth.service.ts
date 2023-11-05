import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common'; 
import { ConfigService } from '@nestjs/config'; 
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service'; 
 import { AuthDto } from './dto/Auth.dto';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';
import { Role } from 'src/common/enums/roles.enum';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService, 
        private readonly jwtService: JwtService,
        private readonly userService: UsersService, 
        private mailService: MailService
    ){}

    async signUp(createUserDto:CreateUserDto): Promise<any>{
        const  userExists = await this.userService.findByEmail(createUserDto.email) 
        if(userExists) throw new BadRequestException('User already exists') 

        const newUser = await this.userService.create(createUserDto) 
        const tokens = await this.getTokens(newUser.id,newUser.email, newUser.roles )
        await this.updateRefreshToken(newUser.email, tokens.refreshToken) 
        setImmediate(async()=>{
            await this.mailService.sendMail(newUser.email)
        })
        return tokens
    }

    async signIn(data:AuthDto){
        const user = await this.userService.findByEmail(data.email)
        if(!user) throw new BadRequestException('User dose not exist')
        const passwordMatched = await this.userService.compare(user.password, data.password) 
        if(!passwordMatched) throw new BadRequestException('Password is incorrect') 
        const tokens = await this.getTokens(user.id, user.email, user.roles) 
        await this.updateRefreshToken(user.email, tokens.refreshToken) 
        return tokens 
    }

    async logout(userId:string){
        return await this.userService.update(userId, {refreshToken:null})
    }
    
    async refreshToken(userId:string, refreshToken:string){
        const user = await this.userService.findById(userId) 
        if(!user || !user.refreshToken) throw new ForbiddenException('Access Denied') 
        const refreshTokenMatched = await this.userService.compare(user.refreshToken, refreshToken)
        if(!refreshTokenMatched) throw new ForbiddenException('Access Denied')
        const tokens = await this.getTokens(user.id, user.email, user.roles) 
        await this.updateRefreshToken(user.email, tokens.refreshToken)
        return tokens
    }

    async updateRefreshToken(email:string, refreshToken:string){
        const hashedRefreshToken = await this.userService.hashData(refreshToken)
        await this.userService.update(email, {refreshToken:hashedRefreshToken})
    }

    async getTokens(userId:string, email:string, roles:Role[]){
        const [accessToken, refreshToken] = await Promise.all([
            
            this.jwtService.signAsync(
                {
                    sub:userId, 
                    email,
                    roles
                }, 
                {
                    secret: this.configService.get<'string'>('JWT_ACCESS_SECRET'), 
                    expiresIn: '15m'
                    
                }
            ), 
            this.jwtService.signAsync(
                {
                    sub:userId, 
                    email
                }, 
                {
                    secret: this.configService.get<'string'>('JWT_REFRESH_SECRET'), 
                    expiresIn:'7d'
                }
            )
        ])
        return {
            accessToken, 
            refreshToken
        }
    }
    
   
    
}
