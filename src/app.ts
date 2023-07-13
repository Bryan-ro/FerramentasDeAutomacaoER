import express from "express";
import router from "./routes/routes";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

async function createFirstAdminUser () {
    try {
        await prisma.user.create({
            data: {
                name: "BRYAN ROCHA",
                email: "bryan.rocha@extremereach.com",
                admin: true
            }
        });

        console.log("Usuario admin criado com sucesso.");
    } catch (error) {
        console.log(error);
    }
}

app.use(cors());
app.use(express.json());
app.use(router);
createFirstAdminUser();

export default app;
