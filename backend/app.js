import express from "express"

import db from "./lib/db.js"
import recipesRouter from "./routes/recipes.js";

const PORT = 3000;

const app = express();

app.set("db", new db());

app.use(express.json({
    limit: "10Mb"
}));

app.use("/recipes", recipesRouter);

app.listen(PORT, () => {
    console.log(`server listening on port: ${PORT}`);
})