import db from "./db.js"

/**
 * 
 * @param {string} login
 * @param {db} dbInstance  
 * @returns {undefined | string}
 */
export function generateAuthToken(login, dbInstance) {
    const user = dbInstance.getUserDataForToken(login);

    if (user) {
        return Buffer.from(JSON.stringify(user)).toString("base64");
    }

    return undefined;
}

/**
 * 
 * @param { string } token
 * @returns { { id: number, name: string, surname: string, email: string, role: string} | undefined } 
 */
export function validateAuthToken(token) {
    try {
        const user = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

        if (user &&
            Object.getOwnPropertyNames(user).filter(
                property =>
                    property === "id" ||
                    property === "name" ||
                    property === "surname" ||
                    property === "email" ||
                    property === "role"
            ).length === 5) {
            return user;
        }
        else {
            return undefined;
        }
    }
    catch {
        return undefined;
    }
}