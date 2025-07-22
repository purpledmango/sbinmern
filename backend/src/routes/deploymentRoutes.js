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
    // Get user ID - adjust based on your authentication method
    const userId = req.user?.uid || req.body?.userId || 'anonymous';
    
    // Create user-specific directory
    const userDir = path.join(__dirname, '../../migrations/', userId);
    
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

export const upload = multer({ 
  storage, // Your previously defined storage configuration
  limits: {
    fileSize: 2000 * 1024 * 1024, // 2GB limit (correct calculation)
    files: 2 // Maximum of 2 files (for your two fields)
  },
  fileFilter: (req, file, cb) => {
    // Optional: Add file type validation
    if (file.fieldname === 'sql_dump') {
      if (!file.originalname.match(/\.(sql|gz|zip)$/i)) {
        return cb(new Error('Only SQL dump files are allowed'));
      }
    }
    if (file.fieldname === 'wp_archives') {
      if (!file.originalname.match(/\.(zip)$/i)) {
        return cb(new Error('Only ZIP archives are allowed'));
      }
    }
    cb(null, true);
  }
});
const router = Router();

// Deployment routes
router.post("/", deployPlan);
router.get("/:deploymentId", fetchDeploymentDetails);
router.post("/restart/:deploymentId", restartDeployment);
router.delete("/:deploymentId", deleteDeployment);
router.get("/status/:deploymentId", getDeploymentStatus);
router.get("/user/:uid", getDeploymentByUser);

// Migration route with user-specific folders
router.post(
  "/migrate-wp",
  // upload.fields([
  //   { name: "sql_dump", maxCount: 1 },
  //   { name: "wp_archives", maxCount: 1 }
  // ]), 
  migrateFiles
);

export default router;