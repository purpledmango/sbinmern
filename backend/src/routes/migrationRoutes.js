import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { migrateFiles } from "../utils/migration.js";
import { fileURLToPath } from 'url';
import authJWTMiddleware from "../utils/authMiddleware.js";
import Migration from "../models/migrationModel.js";
import { getMigrationFileFromUploads, getMigrationOfUser } from "../controllers/migrationControllers.js";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Get user ID - adjust based on your authentication method
    
    
    // Create user-specific directory
    const userDir = path.join(__dirname, '../uploads');
    
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


// Migration route with user-specific folders
router.post(
  "/upload/:mid",
  upload.fields([
    { name: "sql_dump", maxCount: 1 },
    { name: "wp_archives", maxCount: 1 }
  ]), 
  authJWTMiddleware,
  migrateFiles
);

router.get('/:filename', getMigrationFileFromUploads);


router.get('/all/:uid',  authJWTMiddleware, getMigrationOfUser);


router.post("/create", authJWTMiddleware, async (req, res) => {
  try {
    const { uid } = req.user;
    console.log("From front end ", req.body)
    console.log("Uid fetched", req.user.uid)
    console.log("Migration Name->", req.body.name)
    console.log("Migration Instance Type->",  req.body.migrationStack)
    const newMigrationInst = new Migration({name: req.body.name, uid: req.user.uid, migrationStack: req.body.migrationStack})
    await newMigrationInst.save();
    if(!newMigrationInst){
      res.status(203).json({
        status: "fail",
        message: "Failed while creating Migration"
      })
    }
    res.status(201).json({ status: "success", data: newMigrationInst});
  } catch (error) {
    console.error('Migration creation error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.post("/deploy/:mid", authJWTMiddleware, createMigration)

export default router;