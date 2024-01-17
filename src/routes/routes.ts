import { UserController } from "../controllers/userController";
import { RecordBroadcasterController } from "../controllers/recordBroadcasterController";
import { BandBroadcasterController } from "../controllers/bandBroadCasterController";
import { SbtBroadcasterController } from "../controllers/sbtBroadcasterController";
import { Router }  from "express";

const router = Router();
const users = new UserController();
const recordController = new RecordBroadcasterController();
const bandController = new BandBroadcasterController();
const sbtController = new SbtBroadcasterController

router.use("/users", users.routes());
router.use("/record", recordController.routes());
router.use("/band", bandController.routes());
router.use("/sbt", sbtController.routes());

export default router;
