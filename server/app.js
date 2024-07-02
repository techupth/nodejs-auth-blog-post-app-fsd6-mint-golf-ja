import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import postRouter from "./apps/posts.js";
import authRouter from "./apps/auth.js";

const app = express();
const port = 5003;

app.use(cors());
app.use(bodyParser.json());
app.use("/posts", postRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("*", (req, res) => {
  res.status(404).send("Not found");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
