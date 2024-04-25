import _ from "lodash"

import data from "./data.js"

export default class db {
    #generateId(collection) {
        return collection.reduce((prevValue, currentValue) => { return currentValue.id >= prevValue ? currentValue.id + 1 : prevValue }, 1);
    }

    #getRecipeById(id) {
        const idNumber = Number.parseInt(id);

        if (isNaN(idNumber) || idNumber < 1) return undefined;

        return data.recipes.find((recipe => recipe.id === idNumber));
    }

    #getAvgRatingByRecipeId(recipeId) {
        const ratings = this.#getRatingsByRecipeId(recipeId);

        return ratings.reduce((prevValue, currentValue) => { return prevValue + currentValue.value }, 0) / ratings.length
    }

    #getUserById(id) {
        const idNumber = Number.parseInt(id);

        if (isNaN(idNumber) || idNumber < 1) return undefined;

        return data.users.find((user => user.id === idNumber));
    }

    #getCommentsByRecipeId(id) {
        const idNumber = Number.parseInt(id);

        if (isNaN(idNumber) || idNumber < 1) return undefined;

        return data.comments.filter((comment => comment.recipeId === idNumber));
    }

    #getRatingsByRecipeId(id) {
        const idNumber = Number.parseInt(id);

        if (isNaN(idNumber) || idNumber < 1) return undefined;

        return data.ratings.filter((rating => rating.recipeId === idNumber));
    }

    getRecipeDetail(recipeId) {
        const recipe = this.#getRecipeById(recipeId);

        if (recipe === undefined) return undefined;

        const user = this.#getUserById(recipe.userId);
        const comments = _.cloneDeep(this.#getCommentsByRecipeId(recipe.id));

        for (const comment of comments) {
            comment.user = _.pick(this.#getUserById(comment.userId), ["id", "name", "surname"]);
        }

        return {
            ...(_.pick(recipe, ["id", "title", "previewBase64", "contentHTML"])),
            ingredients: data.ingredients.filter(ingredient => ingredient.recipeId === recipe.id).map(({ id, title, content }) => { return { id, title, content } }),
            avgRating: this.#getAvgRatingByRecipeId(recipe.id),
            user: {
                ...(_.pick(user, ["id", "name", "surname"]))
            },
            comments: comments.map((comment) => { return _.pick(comment, ["id", "content", "user"]) })
        }
    }

    getUsersRecipeList(userId) {
        const recipes = _.cloneDeep(data.recipes);

        for (const recipe of recipes) {
            recipe.user = _.pick(this.#getUserById(recipe.userId), ["id", "name", "surname"]);
            recipe.avgRating = this.#getAvgRatingByRecipeId(recipe.id);

            if (userId !== null && userId !== undefined) {
                recipe.favourite = data.bookmarks.find(bookmark => bookmark.userId === userId && bookmark.recipeId === recipe.id) ? true : false;
            }
        }

        return recipes.map(recipe => { return _.pick(recipe, ["id", "previewBase64", "title", "user", "avgRating", "favourite"]) });
    }

    getUserDataForToken(email) {
        const user = _.cloneDeep(data.users.find(user => user.email === email));

        if (user) {
            user.role = data.roles.find(role => role.id === user.roleId).role;
            return _.pick(user, ["id", "email", "name", "surname", "role"]);
        }

        return undefined;
    }

    createBookmark(userId, recipeId) {
        if (userId && recipeId) {
            if (data.bookmarks.find(bookmark => bookmark.recipeId === recipeId && bookmark.userId === userId)) {
                return true;
            }

            data.bookmarks.push({ id: this.#generateId(data.bookmarks), userId, recipeId });
            return true;
        }
        return false;
    }

    removeBookmark(userId, recipeId) {
        if (userId && recipeId) {
            const bookmarkIndex = data.bookmarks.findIndex(bookmark => bookmark.recipeId === recipeId && bookmark.userId === userId);

            if (bookmarkIndex > -1) {
                data.bookmarks.splice(bookmarkIndex, 1);
            }
            return true;
        }
        return false;
    }

    createComment(userId, recipeId, content) {
        if (userId && recipeId && content) {
            data.comments.push({ id: this.#generateId(data.comments), userId, recipeId, content });
            return true;
        }
        return false;
    }

    removeComment(recipeId, commentId) {
        const commentIndex = data.comments.findIndex(({ id, recipeId: recId }) => { return id === commentId && recId === recipeId });

        if (commentIndex > -1) {
            data.comments.splice(commentIndex, 1);
        }
        return true;
    }

    addRating(userId, recipeId, value) {
        if (recipeId && value) {
            data.ratings.push({ id: this.#generateId(data.ratings), userId, recipeId, value });

            return true;
        }
        return false;
    }

    removeRating(ratingId) {
        const ratingIndex = data.ratings.findIndex(({ id }) => { return id === ratingId });

        if (ratingIndex > -1) {
            data.ratings.splice(ratingIndex, 1);
        }
        return true;
    }

    addRecipe({ userId, title, previewBase64 = "", contentHTML = "" }) {
        if (userId && title) {
            data.recipes.push({ id: this.#generateId(data.recipes), userId, title, previewBase64, contentHTML });
            return true;
        }
        return false;
    }

    updateRecipe(recipeId, title, previewBase64, contentHTML) {
        const currentRecipeIndex = data.recipes.findIndex(({ id }) => { return id === recipeId });

        if (currentRecipeIndex > -1) {
            data.recipes[currentRecipeIndex] = { ...data.recipes[currentRecipeIndex], ...{ title, previewBase64, contentHTML } };
            return true;
        }
        return false;
    }

    removeRecipe(recipeId) {
        const recipeIndex = data.recipes.findIndex(({ id }) => { return id === recipeId });

        if (recipeIndex > -1) {
            data.recipes.splice(recipeIndex, 1);
        }
        return true;
    }

    addUser({ name, surname, email }) {
        if (name, surname, email) {
            data.users.push({ id: this.#generateId(data.users), name, surname, email });
            return true;
        }
        return false;
    }
}