import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer'; 
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import {Options} from 'nodemailer/lib/smtp-transport'

@Injectable()
export class MailService {
    constructor(
        private readonly mailerSevice: MailerService, 
        private readonly configService: ConfigService
    ){}

    private async setTransport(){
        const OAuth2 =  google.auth.OAuth2 
        const oauth2Client = new OAuth2(
            this.configService.get<'string'>('GOOGLE_CLIENT_ID'),
            this.configService.get<'string'>('GOOGLE_CLIENT_SECRET'),
            this.configService.get<'string'>('OAUTH_LINK'),
     
        )

        oauth2Client.setCredentials({
            refresh_token: this.configService.get<'string'>('GOOGLE_REFRESH_TOKEN')
        })  
        
        const accessToken:string = await new Promise((resolve, reject)=>{
            oauth2Client.getAccessToken((err, token)=>{
                if(err) reject('Failed to create access token') 
                resolve(token)
            })
        })


        const config:Options = {
            service:'gmail', 
            auth:{
                type:'OAuth2',
                user:this.configService.get<'string'>('EMAIL'), 
                clientId:this.configService.get<'string'>('GOOGLE_CLIENT_ID'), 
                clientSecret:this.configService.get<'string'>('GOOGLE_CLIENT_SECRET'), 
                accessToken
            }
        }
        this.mailerSevice.addTransporter('gmail', config)
    } 

    async sendMail(reciever:string){
        await this.setTransport() 
        this.mailerSevice
        .sendMail({
            transporterName:'gmail', 
            to:reciever, 
            from:this.configService.get<'string'>('EMAIL'), 
            subject:'welcome',
            template:'welcome.html', 
            context:{
                email:reciever
            }
        })
        .then((suucess)=>{
          console.log(suucess)
        })
        .catch((err)=>{
          console.log(err)
        })
    }
}
