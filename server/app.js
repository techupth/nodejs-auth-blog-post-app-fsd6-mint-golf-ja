import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import postRouter from "./apps/posts.js";
import { client } from "./utils/db.js";
import { db } from "./utils/db.js";
import { posts } from "./data/posts.js";
import authRouter from "./apps/auth.js";

async function init() {
  await client.connect();

  try {
    await db.createCollection("posts");
    await db.createCollection("users");
  } catch (error) {
    console.log(error.message);
  }

  const collection = db.collection("posts");

  await collection.insertMany(
    posts.map((post) => {
      return {
        ...post,
        created_at: new Date(post.created_at),
      };
    })
  );
}

init();

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
