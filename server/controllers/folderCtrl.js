import { Router } from "express";
import fs from "fs";
import { join } from "path";
import { formatDirectories, getDirectoryList } from "../bl/folder.bl.js";
const folderRouter = Router();

folderRouter.post("/", async (req, res) => {
  try {
    const path = join(process.cwd(), "files", req.body.folderPath);
    if (!fs.existsSync(path)) {
      await fs.promises.mkdir(path);
    }
    res.send();
  } catch (error) {
    console.log(error);
  }
});

folderRouter.get("/directoryList", async (req, res) => {
  try {
    const directoryList = await getDirectoryList("files");
    const formattedDirectories = await formatDirectories(
      directoryList,
      "files"
    );
    res.send(formattedDirectories);
  } catch (error) {
    console.log("line 26: ", error);
    res.sendStatus(500);
  }
});

folderRouter.delete("/", (req, res) => {
  try {
    fs.rmdirSync(join(process.cwd(), "files", req.body.path));
    res.send();
  } catch (error) {
    res.sendStatus(500);
  }
});

export default folderRouter;
