import { UserController } from "../controllers/userController";
import { RecordBroadcasterController } from "../controllers/recordBroadcasterController";
import { Router }  from "express";

const router = Router();
const users = new UserController();
const recordController = new RecordBroadcasterController();

router.use("/users", users.routes());
router.use("/record", recordController.routes());

export default router;
