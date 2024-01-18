import { PrismaClient } from "@prisma/client";
import { broadcastersValidations } from "../validations/broadcastersValidations";

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

    public static async getBroadcasterFiltered(filter?: string) {
        return await prisma.broadcastersReocord.findMany({
            where: {
                OR: [
                    {
                        broadcasterName: {
                            contains: filter
                        }
                    },
                    {
                        city: {
                            contains: filter
                        }
                    },
                    {
                        state: {
                            contains: filter
                        }
                    },
                    {
                        emails: {
                            contains: filter
                        }
                    }
                ]
            }
        });
    }

    public async createBroadcaster () {
        if(broadcastersValidations.city(this.city) && broadcastersValidations.state(this.state) && broadcastersValidations.codec(this.codec)) {
            await prisma.broadcastersReocord.create({
                data: {
                    broadcasterName: this.broadcasterName,
                    city: this.city,
                    state: this.state,
                    codec: this.codec,
                    emails: this.emails
                }
            });
        } else throw new Error("Invalid Fields");
    }

    public async updateBroadcaster (id: number) {
        if(broadcastersValidations.city(this.city) && broadcastersValidations.state(this.state) && broadcastersValidations.codec(this.codec)) {
            await prisma.broadcastersReocord.update({
                data: {
                    broadcasterName: this.broadcasterName,
                    city: this.city,
                    state: this.state,
                    codec: this.codec,
                    emails: this.emails,
                },
                where: {
                    id: id
                }
            });
        } else throw new Error("Invalid Fields");
    }

    public static async deleteBroadcaster (id: number) {
        const deleted = await prisma.broadcastersReocord.delete({where: { id }});

        if(!deleted) {
            throw new Error("Invalid ID");
        }
    }
}



