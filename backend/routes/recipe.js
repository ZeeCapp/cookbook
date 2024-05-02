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

    res.send(db.getRecipeListWithFavourites(req.user.id));
    return;
});

recipesRouter.get("/bookmarked", async (req, res) => {
    /**
    * @type db
    */
    const db = req.app.get("db");

    res.send(db.getBookmarkedRecipes(req.user.id));
    return;
});

recipesRouter.get("/:id", async (req, res) => {
    const validationResult = await z.number().min(1).safeParseAsync(Number.parseInt(req.params.id));

    if (validationResult.success === false) {
        res.status(400);
        res.send({
            error: "Validation error",
            detail: validationResult.error.format()
        })
        return;
    }

    /**
    * @type db
    */
    const db = req.app.get("db");

    const recipe = db.getRecipeDetail(req.user.id, validationResult.data);

    if (recipe === undefined) {
        res.sendStatus(404);
        return;
    }

    res.send(recipe);
    return;
});

recipesRouter.post("/", async (req, res) => {
    const recipeBlueprint = z.object({
        title: z.string().trim().min(1).optional(),
        previewBase64: z.string().trim().base64().optional(),
        contentHTML: z.string().trim().optional(),
        ingredients: z.array(z.object({
            title: z.string().trim().min(1),
            content: z.string().trim().min(1)
        })).optional()
    })

    const { data, error } = await recipeBlueprint.safeParseAsync(req.body);

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

    if (db.addRecipe(req.user.id, data.title, data.previewBase64, data.contentHTML, data.ingredients)) {
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

    const currentRecipe = db.getRecipeById(data.id);

    if (currentRecipe === undefined || currentRecipe === null) {
        res.sendStatus(404);
        return;
    }

    if (currentRecipe.userId !== req.user.id && req.user.role !== "admin") {
        res.sendStatus(403);
        return;
    }

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

    if (currentRecipe === undefined || currentRecipe === null) {
        res.sendStatus(404);
        return;
    }

    if (currentRecipe.userId !== req.user.id && req.user.role !== "admin") {
        res.sendStatus(403);
        return;
    }

    if (db.deleteRecipe(idParseResult.data)) {
        res.sendStatus(200);
        return;
    }
    res.sendStatus(400);
});

export default recipesRouter;