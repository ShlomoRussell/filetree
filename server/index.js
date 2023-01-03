import express, { json } from "express";
import { config } from "dotenv";
import cors from "cors";

import filesRouter from "./controllers/files.ctrl.js";
import folderRouter from "./controllers/folderCtrl.js";
config();
const PORT = process.env.PORT;
const app = express();
app.use(express.static("static"));
app.use(cors());
app.use(json());
app.use("/file", filesRouter);
app.use("/folder", folderRouter);

app.listen(PORT, () => console.log(`served on PORT: ${PORT}`));
