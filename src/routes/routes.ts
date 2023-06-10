import { UserController } from "../controllers/userController";
import { Router }  from "express";

const router = Router();
const users = new UserController();

router.use("/users", users.routes());

export default router;
