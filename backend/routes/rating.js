import express from "express"
import z from "zod"

import db from "../lib/db.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js"

const ratingRouter = express.Router();

ratingRouter.use(authenticate());
ratingRouter.use(authorize(["admin", "user"]));

ratingRouter.post("/:recipeId/:value", async (req, res) => {
    const idParseResult = await z.number().min(1).safeParseAsync(Number.parseInt(req.params.recipeId));
    const valueParseResult = await z.number().min(1).max(5).safeParseAsync(Number.parseInt(req.params.id));

    if (idParseResult.error) {
        res.status(400);
        res.send({
            error: "Id must be a number"
        });
        return;
    }

    if (valueParseResult.error) {
        res.status(400);
        res.send({
            error: "Value must be a number between 1 and 5 (inclusive)"
        });
        return;
    }

    /**
       * @type db
       */
    const db = req.app.get("db");

    if (db.addRating(req.user.id, idParseResult.data, valueParseResult.data)) {
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
            error: "Id must be a number > 0"
        });
        return;
    }

    /**
    * @type db
    */
    const db = req.app.get("db");

    const currentRating = db.getRatingById(idParseResult.data);

    if (currentRating.userId !== req.user.id && req.user.role !== "admin") {
        res.sendStatus(403);
        return;
    }

    if (db.removeRating(idParseResult.data)) {
        res.sendStatus(200);
        return;
    }

    res.sendStatus(400);
});

export default ratingRouter;