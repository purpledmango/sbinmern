import { config, configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectWithDb from "./src/utils/db.js";
import authMiddleware from "./src/utils/authMiddleware.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
// import infraRoutes from "./src/routes/infraRoutes.js"
import nodeRoutes from "./src/routes/nodeRoutes.js"
import deploymenRoutes from "./src/routes/deploymentRoutes.js"
// import { node } from "./src/controllers/nodeControllers.js";

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
app.use("/deploy", authMiddleware,deploymenRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.listen(PORT, () => {
  console.log(`Backend sever running on -> ${PORT}`);
});
