import { PrismaClient } from "@prisma/client";
import { UserValidations } from "../validations/userValidations";

const prisma = new PrismaClient();

export class User {
    constructor(
        private name: string,
        private email: string,
        private admin: boolean = false
    ) {}

    public static async getAllUsers() {
        return await prisma.user.findMany();
    }

    public static async getUserByEmail(email: string) {
        return await prisma.user.findUnique({
            where: {
                email
            }
        });
    }

    public async createUser(): Promise<void> {
        const nameValidation = UserValidations.nameValidation(this.name);
        const emailValidation = UserValidations.emailValidation(this.email);

        if(nameValidation && emailValidation)
            await prisma.user.create({
                data: {
                    name: (this.name).toUpperCase(),
                    email: (this.email).toLowerCase(),
                    admin: this.admin
                }
            });
        else throw new Error("invalid fields");
    }

    public static async deleteUser(id: number) {
        await prisma.user.delete({
            where: {
                id: id
            }
        });

    }
}
