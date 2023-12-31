import { SetMetadata } from "@nestjs/common"; 
import { Role } from "src/common/enums/roles.enum"; 

export const ROLES_KEY = 'roles'
export const HasRoles = (...roles:Role[]) => SetMetadata(ROLES_KEY, roles)