import { Router } from "express";

import { AuthenticateUserController } from "../controllers/AuthenticateUser.controller";
import { CreateMessageController } from "../controllers/CreateMessage.controller";
import { GetLastMessagesController } from "../controllers/GetLastMessages.controller";
import { ProfileUserController } from "../controllers/ProfileUser.controller";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const router = Router();

router.post("/authenticate", new AuthenticateUserController().handle);

router.post(
  "/messages",
  ensureAuthenticated,
  new CreateMessageController().handle
);

router.get("/messages/lastMessages", new GetLastMessagesController().handle);
router.get("/profile", ensureAuthenticated, new ProfileUserController().handle);

export { router };
