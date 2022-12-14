import { Router } from "express";
import fs from "fs";
import { join } from "path";

const folderRouter = Router();

folderRouter.post("/", (req, res) => {
  try {
    const path = join(process.cwd(), "files", req.body.folderPath);
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    res.send();
  } catch (error) {
    console.log(error);
  }
});

folderRouter.get("/directoryList", (req, res) => {
  try {
    const directoryList = formatDirectories(getDirectoryList("files"), "files");
    res.send(directoryList);
  } catch (error) {
    res.sendStatus(500);
  }

  function getDirectoryList(dir) {
    return fs.readdirSync(join(process.cwd(), dir), { withFileTypes: true });
  }

  function formatDirectories(directoryList, currentDir) {
    return directoryList.reduce((org, dir) => {
      const directory = join(currentDir, dir.name);
      if (dir.isDirectory())
        return [
          ...org,
          {
            [dir.name]: formatDirectories(
              getDirectoryList(directory),
              directory
            ),
          },
        ];
      else return [...org, dir.name];
    }, []);
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
