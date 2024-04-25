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

recipesRouter.post("/:id/comment?:text", async (req, res) => {
    const idParseResult = await z.number().min(1).safeParseAsync(Number.parseInt(req.params.id));
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

recipesRouter.delete("/:id/comment?:commentId", async (req, res) => {
    const idParseResult = await z.number().min(1).safeParseAsync(Number.parseInt(req.params.id));
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

    if (db.removeComment(idParseResult.data, commentIdParseResult.data)) {
        res.sendStatus(200);
        return;
    }

    res.sendStatus(400);
});

recipesRouter.post("/:id/rating:value", async (req, res) => {
    const idParseResult = await z.number().min(1).safeParseAsync(Number.parseInt(req.params.id));
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
            error: "Value must be a number between 1 and 5 (included)"
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

recipesRouter.delete("/:id/rating", async (req, res) => {
    const idParseResult = await z.number().min(1).safeParseAsync(Number.parseInt(req.params.id));

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

    if (db.removeRating(idParseResult.data)) {
        res.sendStatus(200);
        return;
    }

    res.sendStatus(400);
});

recipesRouter.post("/", async (req, res) => {

    const postValidationResult = await z.object({
        title: z.string().min(1),
        previewBase64: z.string().base64().optional().default(""),
        contentHTML: z.string().optional().default("")
    }).safeParseAsync(req.body);

    if (postValidationResult.error) {
        res.status(400);
        res.send({
            error: "Title cannot be empty"
        })
        return;
    }

    /**
    * @type db
    */
    const db = req.app.get("db");

    if (db.addRecipe({ userId: req.user.id, ...postValidationResult.data })) {
        res.sendStatus(201);
        return;
    }
    res.sendStatus(400);
});

recipesRouter.patch("/:id", async (req, res) => {
    const idParseResult = await z.number().min(1).safeParseAsync(Number.parseInt(req.params.id));
    const titleValidationResult = await z.string().min(1).optional().safeParseAsync(req.body.title);
    const previewBase64ValidationResult = await z.string().base64().optional().safeParseAsync(req.body.previewBase64);
    const contentHTMLValidationResult = await z.string().optional().safeParseAsync(req.body.contentHTML);

    if (idParseResult.error) {
        res.status(400);
        res.send({
            error: "Id must be a number > 0"
        });
        return;
    }

    if (titleValidationResult.error) {
        res.status(400);
        res.send({
            error: "Title length must be > 0"
        });
        return;
    }

    if (previewBase64ValidationResult.error) {
        res.status(400);
        res.send({
            error: "Preview image must be Base64 encoded"
        });
        return;
    }

    /**
    * @type db
    */
    const db = req.app.get("db");

    if (db.updateRecipe(idParseResult.data, titleValidationResult.data, previewBase64ValidationResult.data, contentHTMLValidationResult.data)) {
        res.sendStatus(200);
        return;
    }
    res.sendStatus(400);
});

recipesRouter.delete("/:id", async (req, res) => {
    const idParseResult = await z.number().min(1).safeParseAsync(Number.parseInt(req.params.id));

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

    if (db.removeRecipe(idParseResult.data)) {
        res.sendStatus(200);
        return;
    }
    res.sendStatus(400);
});

export default recipesRouter;