import express from "express";
import fs from "fs";

import { DATA_JSON_PATH } from "./../constants";

const router = express.Router();

router.post("/", (req, res) => {
  fs.writeFile(DATA_JSON_PATH, JSON.stringify(req.body, null, 4), (err) => {
    if (err) {
      console.log("Could not save config : ", err);
      res.status(500).send({ message: "Error writing file :" + err });
    }
    res.status(200).send({ message: "Config saved." });
  });
});

export default router;
