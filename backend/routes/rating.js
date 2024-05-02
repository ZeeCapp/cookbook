import express from "express"
import z from "zod"

import db from "../lib/db.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js"

const ratingRouter = express.Router();

ratingRouter.use(authenticate());
ratingRouter.use(authorize(["admin", "user"]));

ratingRouter.post("/:recipeId/:value", async (req, res) => {
    const ratingBlueprint = z.object({
        recipeId: z.number().min(1),
        value: z.number().min(1).max(5)
    });

    const { data, error } = await ratingBlueprint.safeParseAsync({
        recipeId: Number.parseInt(req.params.recipeId),
        value: Number.parseFloat(req.params.value)
    });

    if (error) {
        res.status(400);
        res.send({
            error: "Validation error",
            detail: error.format()
        });
        return;
    }

    /**
       * @type db
       */
    const db = req.app.get("db");

    const currentRecipe = db.getRecipeById(data.recipeId);
    const currentRating = db.getBookmarkByRecipeAndUserId(req.user.id, data.recipeId);

    if (currentRecipe === undefined || currentRecipe === null) {
        res.sendStatus(404);
        return;
    }

    if(currentRating) {
        res.status(400)
        res.send({
            error: "Recipe already rated"
        });
        return;
    }

    if (db.addRating(req.user.id, data.recipeId, data.value)) {
        res.sendStatus(201);
        return;
    }

    res.sendStatus(400);
});

ratingRouter.delete("/:recipeId", async (req, res) => {
    const idParseResult = await z.number().min(1).safeParseAsync(Number.parseInt(req.params.recipeId));

    if (idParseResult.error) {
        res.status(400);
        res.send({
            error: "Validation error",
            detail: idParseResult.error.format()
        });
        return;
    }

    /**
    * @type db
    */
    const db = req.app.get("db");

    const currentRating = db.getRatingById(idParseResult.data);

    if (currentRating === undefined || currentRating === null) {
        res.sendStatus(404);
        return;
    }

    if (currentRating.userId !== req.user.id && req.user.role !== "admin") {
        res.sendStatus(403);
        return;
    }

    if (db.deleteRating(idParseResult.data)) {
        res.sendStatus(200);
        return;
    }

    res.sendStatus(400);
});

export default ratingRouter;