import { DATA_JSON_PATH } from "./../constants";
import express from "express";
import fs from "fs";
const router = express.Router();

router.get("/", (req, res) => {
  const file = fs.readFileSync(DATA_JSON_PATH, "utf8");
  res.send(JSON.parse(file));
});

export default router;
