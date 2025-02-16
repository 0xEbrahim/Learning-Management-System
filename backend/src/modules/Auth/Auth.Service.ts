import prisma from "../../config/prisma";
import { IRegisterBody } from "./Auth.Interface";

class AuthService {
    async register(Payload : IRegisterBody) : Promise<any>{
        
        const user = await prisma.user.create({
            data: {
                name : Payload.name,
                email : Payload.email,
                password : Payload.password
            }
        })
    }
}

export default new AuthService()