import Ajv from "ajv";
import express from "express";
import fs from "fs";

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
      if (err) res.status(500).send({ message: "Error writing file :" + err });
      res.status(200).send();
    }
  );
});

export default router;
