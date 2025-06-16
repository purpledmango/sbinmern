import { Router } from "express";
import { deployPlan, fetchDeploymentDetails, deleteDeployment, getDeploymentStatus, getDeploymentByUser, restartDeployment } from "../controllers/deploymentControllers.js";


const router = Router();

// deploy the neccessary templates and containers

router.post("/", deployPlan)

router.get("/:deploymentId", fetchDeploymentDetails)
router.post("/restart/:deploymentId", restartDeployment)
router.delete("/:deploymentId", deleteDeployment)
router.get("/status/:deploymentId", getDeploymentStatus)
router.get("/user/:uid", getDeploymentByUser)

export default router;