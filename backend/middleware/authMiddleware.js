import { validateAuthToken } from "../lib/authService.js"

export function authenticate() {
    /**
    * @param { import("express").Request } req
    * @param { import("express").Response } res
    * @param { () => void } next
    */
    return (req, res, next) => {
        const user = validateAuthToken(req.headers.authorization?.split(" ")[1]);

        if (user) {
            req.user = user;
            next();
        }
        else {
            res.sendStatus(401);
            return;
        }
    }
}

export function authorize(roles) {
    /**
    * @param { import("express").Request } req
    * @param { import("express").Response } res
    * @param { () => void } next
    */
    return (req, res, next) => {
        if (req.user === undefined || req.user === null) {
            const user = validateAuthToken(req.headers.authorization?.split(" ")[1]);

            if (user) {
                req.user = user;
            }
            else {
                res.sendStatus(401);
                return;
            }
        }

        for (const role of roles) {
            if (req.user.role === role) {
                next();
                return;
            }
        }

        res.sendStatus(403);
        return;
    }
}