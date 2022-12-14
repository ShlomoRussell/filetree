import express, { Router } from "express";
import fs from "fs";
import { join } from "path";
const filesRouter = Router();

filesRouter.post("/", (req, res) => {
  try {
    fs.closeSync(
      fs.openSync(join(process.cwd(), "files", req.body.filePath), "a")
    );
    res.send();
  } catch (error) {
    console.log(error);
  }
});

filesRouter.post("/save", (req, res) => {
  try {
    fs.writeFileSync(
      join(process.cwd(), "files", req.body.filePath),
      req.body.fileContents,
      "utf-8"
    );
    res.send();
  } catch (error) {
    console.log(error);
  }
});

filesRouter.get("/", (req, res) => {
  try {
    const fileContents = fs.readFileSync(
      join(process.cwd(), "files", req.headers.filepath),
      "utf-8"
    );
    res.send(fileContents);
  } catch (error) {
    res.sendStatus(500);
  }
});

filesRouter.delete("/", (req, res) => {
  try {
    fs.unlinkSync(join(process.cwd(), "files", req.body.path));
    res.send();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

export default filesRouter;
