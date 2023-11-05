import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller'; 
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports:[
    UsersModule,
    MailModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController], 
  providers:[AuthService,AccessTokenStrategy, RefreshTokenStrategy], 
  exports:[AuthService, JwtModule]
})
export class AuthModule {}
