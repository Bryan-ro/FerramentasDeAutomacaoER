import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class RecordBroadcaster {
    constructor (
        private broadcasterName: string,
        private city: string,
        private state: string,
        private codec: string,
        private emails: string
    ) {}

    public static async getBroadcasterById(id: number) {
        return await prisma.broadcastersReocord.findUnique({
            where: {
                id: id
            }
        });
    }

    public async createBroadcaster () {
        await prisma.broadcastersReocord.create({
            data: {
                broadcasterName: this.broadcasterName,
                city: this.city,
                state: this.state,
                codec: this.codec,
                emails: this.emails
            }
        });
    }


}
