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
}