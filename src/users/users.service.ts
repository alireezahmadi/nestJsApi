import { Injectable, BadRequestException } from '@nestjs/common'; 
import { InjectModel } from '@nestjs/mongoose'; 
import { User, UserDocument } from './schamas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import * as argon2 from 'argon2'

@Injectable()
export class UsersService {
    
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(createUserDto:CreateUserDto):Promise<UserDocument>{
        const hash = await this.hashData(createUserDto.password)
        const createdUser = await new this.userModel({...createUserDto,password:hash }) 
        return createdUser.save()
    }
    async findAll():Promise<UserDocument[]>{
        return await this.userModel.find()
    }
    async findById(id:string):Promise<UserDocument>{
        return await this.userModel.findById(id).exec()
    }
    async findByEmail(email:string): Promise<UserDocument>{
        return await this.userModel.findOne({email}).exec()
    }
    async update(email:string, updateUserDto:UpdateUserDto ){
        return await this.userModel
            .findOneAndUpdate({email}, updateUserDto, {new:true})
            .exec()
    }
    async remove(email:string){
     
        return await this.userModel.findOneAndDelete({email}).exec() 
    }

    async hashData(data: string){
        return argon2.hash(data)
    }

    async compare(item:string, candidateItem:string):Promise<boolean>{
        return argon2.verify(item, candidateItem)
    }

    
}
