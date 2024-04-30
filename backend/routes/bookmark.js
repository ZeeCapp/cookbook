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

bookmarkRouter.delete("/:recipeId", async (req, res) => {
    const validationResult = await z.number().min(1).safeParseAsync(Number.parseInt(req.params.recipeId));

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
});

export default bookmarkRouter;