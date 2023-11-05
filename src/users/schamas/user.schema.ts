import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument   } from "mongoose"; 
import { Role } from "src/common/enums/roles.enum";

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
    @Prop({required:true, unique:true})
    email:string;

    @Prop({required:true, trim:true})
    password:string; 

    @Prop({trim:true})
    refreshToken:string; 

    @Prop({default:Role.User})
    roles:Role[]
};

export const UserSchema = SchemaFactory.createForClass(User)