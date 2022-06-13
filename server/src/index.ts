import axios from "axios";
import express from "express";
import cors from "cors";

import config from "./routes/config";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/api", (req, res) => {
  res.status(200).send({ message: "Running", healthy: true });
});

app.use("/api/config", config);

app.use("/api/autocomplete", async (req, res) => {
  return res.send(
    await (
      await axios.get(`https://duckduckgo.com/ac/?q=${req.query.query}`)
    ).data
  );
});
