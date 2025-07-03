import { Router } from "express";
import { deployPlan, fetchDeploymentDetails, deleteDeployment, getDeploymentStatus, getDeploymentByUser, restartDeployment } from "../controllers/deploymentControllers.js";
import multer from "multer";
import fs from "fs";
import path from "path";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../../migrations");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const router = Router();

// deploy the neccessary templates and containers

router.post("/", deployPlan)

router.get("/:deploymentId", fetchDeploymentDetails)
router.post("/restart/:deploymentId", restartDeployment)
router.delete("/:deploymentId", deleteDeployment)
router.get("/status/:deploymentId", getDeploymentStatus)
router.get("/user/:uid", getDeploymentByUser)
router.post("/migrate-wp", upload.array("wp_archives", "sql_dump"));
export default router;