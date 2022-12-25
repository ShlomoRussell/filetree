import fs from "fs";
import { join } from "path";

export async function getDirectoryList(dir) {
  const path = join(process.cwd(), dir);
  const directoryList = await fs.promises.readdir(path, {
    withFileTypes: true,
  });
  return directoryList;
}
/**
 *
 * @param {fs.Dirent[]} directoryList
 * @param {string} currentDir
 * @returns
 */
export async function formatDirectories(directoryList, currentDir) {
  const formattedDirectories = [];
  for (const dir of directoryList) {
    if (dir.isDirectory()) {
      const directory = join(currentDir, dir.name);
      const list = await getDirectoryList(directory);
      formattedDirectories.push({
        [dir.name]: await formatDirectories(list, directory),
      });
    } else {
      formattedDirectories.push(dir.name);
    }
  }
  return formattedDirectories;
}
