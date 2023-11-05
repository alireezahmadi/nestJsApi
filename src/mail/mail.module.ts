import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';
@Module({
  imports:[
    MailerModule.forRoot({
      transport: "smtps://alirezaahmadi000216@gmail.com:ivy489545@smtp.gmail.com",
      template:{
        dir: join(__dirname,'/templates/'), 
        adapter: new EjsAdapter(), 
        options:{
          strict: false
        }
      }
    })
  ],
  providers: [MailService], 
  
  exports:[MailService, MailerModule]
})
export class MailModule {}
