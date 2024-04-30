import express from "express"
import z from "zod"

import db from "../lib/db.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js"

const commentsRouter = express.Router();

commentsRouter.use(authenticate());
commentsRouter.use(authorize(["admin", "user"]));


commentsRouter.post("/:recipeId/:text", async (req, res) => {
    const idParseResult = await z.number().min(1).safeParseAsync(Number.parseInt(req.params.recipeId));
    const textParseResult = await z.string().min(1).max(200).safeParseAsync(req.query.text);

    if (idParseResult.error) {
        res.status(400);
        res.send({
            error: "Id must be a number > 0"
        });
        return;
    }

    if (textParseResult.error) {
        res.status(400);
        res.send({
            error: "Comment text can't be empty"
        });
        return;
    }

    /**
       * @type db
       */
    const db = req.app.get("db");

    if (db.createComment(req.user.id, idParseResult.data, textParseResult.data)) {
        res.sendStatus(201);
        return;
    }

    res.sendStatus(400);
});

commentsRouter.delete("/:recipeId/:commentId", async (req, res) => {
    const idParseResult = await z.number().min(1).safeParseAsync(Number.parseInt(req.params.recipeId));
    const commentIdParseResult = await z.number().min(1).safeParseAsync(Number.parseInt(req.query.commentId));

    if (idParseResult.error) {
        res.status(400);
        res.send({
            error: "Id must be a number > 0"
        });
        return;
    }

    if (commentIdParseResult.error) {
        res.status(400);
        res.send({
            error: "Comment Id must be a number > 0"
        });
        return;
    }

    /**
       * @type db
       */
    const db = req.app.get("db");

    const currentComment = db.getCommentById(commentIdParseResult.data);

    if (currentComment.userId !== req.user.id && req.user.role !== "admin") {
        res.sendStatus(403);
        return;
    }

    if (db.removeComment(idParseResult.data, commentIdParseResult.data)) {
        res.sendStatus(200);
        return;
    }

    res.sendStatus(400);
});

export default commentsRouter;