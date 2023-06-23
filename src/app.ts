import express from "express";
import router from "./routes/routes";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

async function createFirstAdminUser () {
    try {
        await prisma.user.create({
            data: {
                name: "Bryan Rocha",
                email: "bryan.rocha@extremereach.com",
                admin: true
            }
        });

        console.log("Usuario admin criado com sucesso.");
    } catch (error) {
        console.log(error);
    }

}

app.use(express.json());
app.use(router);
createFirstAdminUser();

export default app;
