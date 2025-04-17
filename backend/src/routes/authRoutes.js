import { Router } from "express";
import {
  signUpController,
  loginController,
  logoutController
} from "../controllers/authControllers.js";

const router = Router();

router.post("/signup", signUpController);
// Uncomment the following lines and add the controllers when needed
router.post("/login", loginController);
router.get("/logout", logoutController);

export default router;
