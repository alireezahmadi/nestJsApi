import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module'; 
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/schamas/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRoot(process?.env.MONGO_URI),

    UsersModule, AuthModule, MailModule],
  controllers: [AppController],
  providers: [AppService, AuthService, UsersService],
})
export class AppModule {}
