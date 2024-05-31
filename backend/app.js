import express from "express";
import cors from "cors";

import db from "./lib/db.js";
import recipesRouter from "./routes/recipe.js";
import authRouter from "./routes/auth.js";
import bookmarkRouter from "./routes/bookmark.js";
import commentRouter from "./routes/comment.js";
import ratingRouter from "./routes/rating.js";

const PORT = 5001;

const app = express();

app.set("db", new db());

app.use(
  express.json({
    limit: "10Mb",
  })
);

app.use(cors());

app.use("/auth", authRouter);
app.use("/recipe", recipesRouter);
app.use("/bookmark", bookmarkRouter);
app.use("/comment", commentRouter);
app.use("/rating", ratingRouter);

app.listen(PORT, () => {
  console.log(`server listening on port: ${PORT}`);
});
