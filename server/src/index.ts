import axios from "axios";
import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

import data from "./routes/data";
import config from "./routes/config";

const app = express();
const port = 3001;

if (!process.env.NODE_ENV) {
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 10,
    })
  );
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/api/health", (req, res) => {
  res.status(200).send({ message: "Running", healthy: true });
});

app.use("/api/config", config);
app.use("/api/data", data);

app.use("/api/autocomplete", async (req, res) => {
  for (let index = 0; index < 10000; index++) {}
  res.send(
    await (
      await axios.get(`https://duckduckgo.com/ac/?q=${req.query.query}`)
    ).data
  );
});
