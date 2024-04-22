import express from "express"
import z from "zod"

import db from "../lib/db.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js"

const recipesRouter = express.Router();

recipesRouter.use(authenticate());
recipesRouter.use(authorize(["admin", "user"]));

recipesRouter.get("/", async (req, res) => {
    /**
    * @type db
    */
    const db = req.app.get("db");

    const userAuth = JSON.parse(Buffer.from(req.headers.authorization.split(" ")[1], "base64").toString("utf-8"));

    res.send(db.getUsersRecipeList(userAuth.userId));
    return;
});

recipesRouter.get("/:id", async (req, res) => {
    const validationResult = await z.number().min(1).safeParseAsync(Number.parseInt(req.params.id));

    if (validationResult.success === false) {
        res.status(400);
        res.send({
            error: "Id must be a number > 0"
        })
        return;
    }

    /**
    * @type db
    */
    const db = req.app.get("db");

    const recipe = db.getRecipeDetail(validationResult.data);

    if (recipe === undefined) {
        res.status(404);
        res.send({
            error: "Recipe not found"
        });
        return;
    }

    res.send(recipe);
    return;
});

recipesRouter.post("/", async (req, res) => {

});

recipesRouter.post("/:id/comment:text", async (req, res) => {

});

recipesRouter.post("/:id/rating:value", async (req, res) => {

});

export default recipesRouter;