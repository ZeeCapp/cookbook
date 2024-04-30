import express from "express"
import z from "zod"

import db from "../lib/db.js";
import { generateAuthToken } from "../lib/authService.js";

const authRouter = express.Router();

authRouter.get("/login?:login", async (req, res) => {
    /**
    * @type db
    */
    const db = req.app.get("db");

    const emailParseResult = await z.string().email().safeParseAsync(req.query.login);

    if (emailParseResult.error) {
        res.status(400);
        res.send({
            error: "Login must be an email"
        });
        return;
    }

    const login = emailParseResult.data;

    const token = generateAuthToken(login, db);

    if (token) {
        res.send({ token });
        return;
    }
    else {
        res.status(400);
        res.send({
            error: "User not found"
        });
        return;
    }
});

authRouter.post("/register", async (req, res) => {
    const userBlueprint = z.object({
        email: z.string().trim().email(),
        name: z.string().trim().min(1),
        surname: z.string().trim().min(1)
    })

    const { data, error } = await userBlueprint.safeParseAsync({
        email: req.query.email,
        name: req.query.name,
        surname: req.query.surname
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

    if (db.addUser(data.name, data.surname, data.email)) {
        res.sendStatus(201);
        return;
    }
    res.sendStatus(400);
});

export default authRouter;