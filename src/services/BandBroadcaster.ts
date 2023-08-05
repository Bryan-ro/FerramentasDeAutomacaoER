import { PrismaClient } from "@prisma/client";
import { broadcastersValidations } from "../validations/broadcastersValidations";

const prisma = new PrismaClient();

export class BandBroadcaster {
    constructor (
        private broadcasterName: string,
        private city: string,
        private state: string,
        private codec: string,
        private emails: string
    ) {}

    public static async getBroadcasterById(id: number) {
        return await prisma.broadcastersBand.findUnique({
            where: {
                id: id
            }
        });
    }

    public static async getBroadcasterFiltered(filter?: string) {
        return await prisma.broadcastersBand.findMany({
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
            await prisma.broadcastersBand.create({
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
            await prisma.broadcastersBand.update({
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

    // public async deleteBroadcaster (id: number) {

    // }
}



