import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { bodyParser, create, defaults, router } from "json-server";
import { nanoid } from "nanoid";
import { LevelData } from "@srpg-engine/api";

type DB = {
  levels: LevelData[];
};
const dataPath = resolve(__dirname, "../data");
const dbPath = resolve(dataPath, "db.json");

const createDataDir = () => {
  try {
    mkdirSync(dataPath);
  } catch (err) {
    if (err) {
      console.log("The data directory already exists!");
      return;
    }

    console.log("Created the data directory!");
  }
};

const readDbFile = () => {
  try {
    const data = readFileSync(dbPath, null);
    const db = JSON.parse(data.toString()) as DB;

    // ensure routes exist
    db.levels ??= [];

    console.log("DB file exists and includes all routes!");
  } catch {
    console.log("Could not read the DB file, let's create a new one!");
    createDbFile();
  }
};

const createDbFile = () => {
  try {
    writeFileSync(
      dbPath,
      JSON.stringify({
        levels: [],
      }),
      { flag: "wx" }
    );
    console.log("New DB file created!");
  } catch (error) {
    console.error("Could not write a new db file!", error);
    throw error;
  }
};

createDataDir();
readDbFile();

const app = create();
const routes = router(dbPath);

const middlewares = defaults();

app.use(middlewares);
app.use(bodyParser);
app.use((req, _res, next) => {
  if (req.method === "POST") {
    req.body.id = nanoid();
    req.body.createdOn = Date.now();
  }

  if (req.method === "PATCH" || req.method === "PUT") {
    req.body.updatedOn = Date.now();
  }

  next();
});

app.use("/api", routes);
app.listen(3000, () => {
  console.log("JSON Server is running!");
});
