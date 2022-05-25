const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");
const fs = require("fs");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/api", (req, res) => {
  res.send("Running");
});

app.post("/api/config", (req, res) => {
  fs.writeFile(
    "../public/data.json",
    JSON.stringify(req.body, null, 4),
    (err) => {
      if (err) res.status(500).send("Error writing file :", err);
      res.status(200).send();
    }
  );
});
