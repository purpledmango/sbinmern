import { Router } from "express";
import { deployPlan, fetchDeploymentDetails, deleteDeployment, getDeploymentStatus, getDeploymentByUser, restartDeployment } from "../controllers/deploymentControllers.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { migrateFiles } from "../utils/migration.js";


import { fileURLToPath } from 'url';
// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../migrations');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

export const upload = multer({ storage });


const router = Router();

// deploy the neccessary templates and containers

router.post("/", deployPlan)

router.get("/:deploymentId", fetchDeploymentDetails)
router.post("/restart/:deploymentId", restartDeployment)
router.delete("/:deploymentId", deleteDeployment)
router.get("/status/:deploymentId", getDeploymentStatus)
router.get("/user/:uid", getDeploymentByUser)
router.post(
  "/migrate-wp",
  upload.fields([
    { name: "sql_dump", maxCount: 1 },
    { name: "wp_archives", maxCount: 1 }
  ]), migrateFiles
);
export default router;