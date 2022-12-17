import { Router } from "express";
import fs from "fs";
import { join } from "path";
const filesRouter = Router();

filesRouter.post("/", async (req, res) => {
  const path = join(process.cwd(), "files", req.body.filePath);
  try {
    const file = await fs.promises.open(path, "a");
    await file.close()
    res.send();
  } catch (error) {
    console.log(error);
  }
});

filesRouter.post("/save", async (req, res) => {
  const path = join(process.cwd(), "files", req.body.filePath);
  try {
    await fs.promises.writeFile(path, req.body.fileContents, "utf-8");
    res.send();
  } catch (error) {
    console.log(error);
  }
});

filesRouter.get("/", async (req, res) => {
  const path = join(process.cwd(), "files", req.headers.filepath);
  try {
    const fileContents = await fs.promises.readFile(path, "utf-8");
    res.send(fileContents);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

filesRouter.delete("/", async (req, res) => {
  const path = join(process.cwd(), "files", req.body.path);
  try {
    await fs.promises.unlink(path);
    res.send();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

filesRouter.put("/", async (req, res) => {
  const oldPath = join(process.cwd(), "files", req.body.oldPath);
  const newPath = join(process.cwd(), "files", req.body.newPath);
  try {
    await fs.promises.rename(oldPath, newPath);
    res.send();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

export default filesRouter;
