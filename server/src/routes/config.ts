import Ajv from "ajv";
import express from "express";
import fs from "fs";
import { exec } from "child_process";

import { schema } from "../../../client/src/models/AppData";

const router = express.Router();

router.post("/", (req, res) => {
  const ajv = new Ajv({ allErrors: true, verbose: true });
  if (!ajv.validate(schema, req.body))
    res.status(500).send({ message: "Data is not coherent with schema" });

  fs.writeFile(
    "../client/public/data.json",
    JSON.stringify(req.body, null, 4),
    (err) => {
      if (err) {
        console.log("Could not save config : ", err);
        res.status(500).send({ message: "Error writing file :" + err });
      }
      const runDate = new Date().toLocaleString("en-US");
      console.log("Config saved on " + runDate);
      exec(
        "cd /app && yarn workspace client docker:build",
        (error, stdout, stderr) => {
          console.log(`------ OUTPUT BUILD ${runDate} ------`);
          console.log(`${stdout}`);
          if (error) {
            console.log(`--- ERROR BUILD ${runDate} ---`);
            console.log(`${error.message}`);
            console.log(`--- END ERROR ---`);
          }
          if (stderr) {
            console.log(`--- ERROR BUILD ${runDate} ---`);
            console.log(`${stderr}`);
            console.log(`--- END ERROR ---`);
          }
          console.log(`------ END OUTPUT ------`);
        }
      );
      res.status(200).send({ message: "Config saved. Running build..." });
    }
  );
});

export default router;
