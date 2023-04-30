const { mkdirSync, readdir, copyFile } = require("node:fs");
const { resolve } = require("node:path");
const { exit } = require("node:process");

const models = resolve(__dirname, "../models");
const target = resolve(process.cwd(), "public/models");

const trimPath = (path) => {
  const paths = path.split("/");
  const index = paths.indexOf("srpg-engine");
  const trimmed = paths.slice(index + 1);
  return trimmed.join("/");
};

try {
  mkdirSync(target, { recursive: true });
} catch {
  // exists
}

readdir(models, (error, files) => {
  if (error) {
    console.error(error);
    exit(error.code ?? 1);
  }

  files.forEach((file) => {
    copyFile(resolve(models, file), resolve(target, file), (err) => {
      if (err) {
        console.error(err);
        exit(error.code ?? 1);
      }
    });
  });

  console.info(
    `Copied ${files.length} models from ${trimPath(models)} to ${trimPath(
      target
    )}`
  );

  exit(0);
});
