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

recipesRouter.post("/", async (req, res) => {
    const titleValidationResult = await z.string().min(1).optional().safeParseAsync(req.body.title);
    const previewBase64ValidationResult = await z.string().base64().optional().safeParseAsync(req.body.previewBase64);
    const contentHTMLValidationResult = await z.string().optional().safeParseAsync(req.body.contentHTML);

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

    if (Array.isArray(req.body.ingredients)) {
        for (const ingredient of req.body.ingredients) {
            const ingredientTitleValidationResult = await z.string().trim().min(1).safeParseAsync(ingredient.title);
            const ingredientContentValidationResult = await z.string().trim().min(1).safeParseAsync(ingredient.content);

            if (ingredientTitleValidationResult.error) {
                res.status(400);
                res.send({
                    error: "Ingredient title cannot be empty"
                })
                return;
            }

            if (ingredientContentValidationResult.error) {
                res.status(400);
                res.send({
                    error: "Ingredient content cannot be empty"
                })
                return;
            }
        }
    }

    /**
    * @type db
    */
    const db = req.app.get("db");

    if (db.addRecipe(req.user.id, titleValidationResult.data, previewBase64ValidationResult.data, contentHTMLValidationResult.data, req.body.ingredients)) {
        res.sendStatus(201);
        return;
    }
    res.sendStatus(400);
});

recipesRouter.patch("/:id", async (req, res) => {
    const recipeBlueprint = z.object({
        id: z.number().min(1),
        title: z.string().trim().min(1).optional(),
        previewBase64: z.string().trim().base64().optional(),
        contentHTML: z.string().trim().optional(),
        ingredients: z.array(z.object({
            title: z.string().trim().min(1),
            content: z.string().trim().min(1)
        })).optional()
    })

    const { data, error } = await recipeBlueprint.safeParseAsync({ id: Number.parseInt(req.params.id), ...req.body });

    if (error) {
        res.status(400);
        res.send({
            message: "Validation error",
            detail: error.format()
        })
        return;
    }

    /**
    * @type db
    */
    const db = req.app.get("db");

    if (db.updateRecipe(data.id, data.title, data.previewBase64, data.contentHTML, data.ingredients)) {
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

    const currentRecipe = db.getRecipeById(idParseResult.data);

    if (currentRecipe.userId !== req.user.id && req.user.role !== "admin") {
        res.sendStatus(403);
        return;
    }

    if (db.removeRecipe(idParseResult.data)) {
        res.sendStatus(200);
        return;
    }
    res.sendStatus(400);
});

export default recipesRouter;