var fs = require("fs");
var path = require("path");
const { promisify } = require("util");
const { series, src, dest } = require("gulp");
const del = require("del");


const sourceDir = path.posix.join(__dirname, "build");
const destDir = path.join(__dirname, "../", "server", "static");

function cleanSource(cb) {
  return del(`${sourceDir}/`, { force: true });
}

function copyToTarget(cb) {
  return src(`${sourceDir}/**`).pipe(dest(destDir));
}
function cleanTarget(cb) {
  return del(`${destDir}/`, { force: true });
}
const stdio = "inherit";
async function commitTagPush() {
  const {execa} = await import("execa");

  // even though we could get away with "require" in this case, we're taking the safe route
  // because "require" caches the value, so if we happen to use "require" again somewhere else
  // we wouldn't get the current value, but the value of the last time we called "require"
  const { version } = JSON.parse(await promisify(fs.readFile)("package.json"));
  const commitMsg = `chore: release ${version}`;
  await execa("git", ["add", "."], { stdio });
  await execa("git", ["commit", "--message", commitMsg], { stdio });
  await execa("git", ["tag", `v${version}`], { stdio });
  await execa("git", ["push", "--follow-tags"], { stdio });
}
exports.default = series(cleanTarget, copyToTarget, cleanSource, commitTagPush);
