import { PrismaClient } from "@prisma/client";

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
        await prisma.user.create({
            data: {
                name: this.name,
                email: this.email,
                admin: this.admin
            }
        });
    }
}
