/**
 * Este código era usado para armazenar o histórico de envios para Record. Mas como o banco de dados utilizado é grátis, sem muito armazenamento,
 * decidi não implementar essa feature. Mas não apaguei o código, para caso um dia tivesse um banco de dados maior.
 */


import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class RecordHistory{
    constructor(
        private destinations: string,
        private clock: string,
        private user: string
    ) {}

    public static async getDestinationsFiltered(filter?: string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const history: any = await prisma.recordHistory.findMany({
            where: {
                OR: [
                    {
                        destinations: {
                            contains: filter
                        }
                    },
                    {
                        clock: {
                            contains: filter
                        }
                    },
                    {
                        user: {
                            contains: filter
                        }
                    }
                ]
            }
        });

        for(const i in history) {
            history[i].destinations = history[i].destinations.split(",");
            history[i].clock = history[i].clock.split(",");
        }

        return history;
    }

    public async RecordHistory(): Promise<void> {
        await prisma.recordHistory.create({
            data: {
                date: new Date(),
                clock: this.clock,
                destinations: this.destinations,
                user: this.user
            }
        });
    }
}
