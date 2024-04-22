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

export default authRouter;