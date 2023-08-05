import { UserController } from "../controllers/userController";
import { RecordBroadcasterController } from "../controllers/recordBroadcasterController";
import { BandBroadcasterController } from "../controllers/bandBroadCasterController";
import { Router }  from "express";

const router = Router();
const users = new UserController();
const recordController = new RecordBroadcasterController();
const bandController = new BandBroadcasterController();

router.use("/users", users.routes());
router.use("/record", recordController.routes());
router.use("/band", bandController.routes());

export default router;
