import express from "express"
import z from "zod"

import db from "../lib/db.js";
import data from "../lib/data.js"
import { authenticate, authorize } from "../middleware/authMiddleware.js"

const recipesRouter = express.Router();

recipesRouter.get("/diagnose", (req, res) => {
    res.send(data);
})

recipesRouter.use(authenticate());
recipesRouter.use(authorize(["admin", "user"]));

recipesRouter.get("/", async (req, res) => {
    /**
    * @type db
    */
    const db = req.app.get("db");

    res.send(db.getUsersRecipeList(req.user.id));
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

recipesRouter.post("/favourite/:id", async (req, res) => {
    const validationResult = await z.number().min(1).safeParseAsync(Number.parseInt(req.params.id));

    if (validationResult.success === false) {
        res.status(400);
        res.send({
            error: "Id must be a number > 0"
        })
        return;
    }

    if (req.user && validationResult.success) {
        /**
        * @type db
        */
        const db = req.app.get("db");
        if (db.createBookmark(req.user.id, Number.parseInt(validationResult.data))) {
            res.sendStatus(201);
            return;
        } else {
            res.sendStatus(400);
            return;
        }
    } else {
        res.sendStatus(400);
        return;
    }
});

recipesRouter.delete("/favourite/:id", async (req, res) => {
    const validationResult = await z.number().min(1).safeParseAsync(Number.parseInt(req.params.id));

    if (validationResult.success === false) {
        res.status(400);
        res.send({
            error: "Id must be a number > 0"
        })
        return;
    }

    if (req.user && validationResult.success) {
        /**
        * @type db
        */
        const db = req.app.get("db");
        if (db.removeBookmark(req.user.id, validationResult.data)) {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
})

recipesRouter.post("/", async (req, res) => {

});

recipesRouter.post("/:id/comment:text", async (req, res) => {

});

recipesRouter.post("/:id/rating:value", async (req, res) => {

});

export default recipesRouter;