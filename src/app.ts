import express from "express";
import router from "./routes/routes";
import { PrismaClient } from "@prisma/client";

const app = express();



app.use(express.json());
app.use(router);

export default app;
