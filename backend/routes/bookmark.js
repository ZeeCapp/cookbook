import express from "express"
import z from "zod"

import db from "../lib/db.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js"

const bookmarkRouter = express.Router();

bookmarkRouter.use(authenticate());
bookmarkRouter.use(authorize(["admin", "user"]));

bookmarkRouter.post("/:recipeId", async (req, res) => {
    const validationResult = await z.number().min(1).safeParseAsync(Number.parseInt(req.params.recipeId));

    if (validationResult.success === false) {
        res.status(400);
        res.send({
            error: "Validation error",
            detail: validationResult.error
        })
        return;
    }

    /**
    * @type db
    */
    const db = req.app.get("db");

    const currentRecipe = db.getRecipeById(validationResult.data)
    const currentBookmark = db.getBookmarkByRecipeAndUserId(req.user.id, validationResult.data);

    if (currentRecipe === undefined || currentRecipe === null) {
        res.sendStatus(404);
        return;
    }

    if (currentBookmark !== undefined && currentBookmark !== null) {
        res.status(400);
        res.send({
            error: "Recipe already bookmarked"
        });
        return;
    }

    if (db.createBookmark(req.user.id, Number.parseInt(validationResult.data))) {
        res.sendStatus(201);
        return;
    } else {
        res.sendStatus(400);
        return;
    }
});

bookmarkRouter.delete("/:recipeId", async (req, res) => {
    const validationResult = await z.number().min(1).safeParseAsync(Number.parseInt(req.params.recipeId));

    if (validationResult.success === false) {
        res.status(400);
        res.send({
            error: "Validation error",
            detail: validationResult.error
        })
        return;
    }

    if (req.user && validationResult.success) {
        /**
        * @type db
        */
        const db = req.app.get("db");

        const currentBookmark = db.getBookmarkByRecipeAdnUserId(req.user.id, validationResult.data);

        if (currentBookmark === undefined || currentBookmark === null) {
            res.sendStatus(404);
            return;
        }

        if (db.deleteBookmark(req.user.id, validationResult.data)) {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
});

export default bookmarkRouter;