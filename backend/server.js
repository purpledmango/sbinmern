import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectWithDb from "./src/utils/db.js";
import authMiddleware from "./src/utils/authMiddleware.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
// import infraRoutes from "./src/routes/infraRoutes.js"
import nodeRoutes from "./src/routes/nodeRoutes.js";
import deploymentRoutes from "./src/routes/deploymentRoutes.js";
import migrationRoutes from "./src/routes/migrationRoutes.js";
import fs from "fs";
import authJWTMiddleware from "./src/utils/authMiddleware.js";

configDotenv();
connectWithDb(process.env.DB_URI);

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/user", authMiddleware, userRoutes);
// app.use("/infra", getNodes);
app.use("/infra", nodeRoutes);
app.use("/migrate", migrationRoutes);
app.use("/deploy", authJWTMiddleware, deploymentRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Migration files endpoint
app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'src/uploads/', filename);
    
    // Security checks
   
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
    }
    
    if (fs.statSync(filePath).isDirectory()) {
        return res.status(400).json({ error: "Invalid file" });
    }
    
    // Set appropriate headers
    let contentType = 'application/octet-stream';
    if (filename.endsWith('.sql')) contentType = 'application/sql';
    if (filename.endsWith('.zip')) contentType = 'application/zip';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
});

// Test endpoint
app.get('/test-file', (req, res) => {
    const testPath = path.join(__dirname, 'src/migrations/test.txt');
    fs.writeFileSync(testPath, 'test content');
    res.send(`Test file created at: ${testPath}`);
});

app.listen(PORT, () => {
    console.log(`Backend server running on -> ${PORT}`);
});

app.timeout = 600000; 