import _ from "lodash"

import data from "./data.js"

export default class db {
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
            avgRating: this.#getAvgRatingByRecipeId(recipe.id),
            user: {
                ...(_.pick(user, ["id", "name", "surname"]))
            },
            comments: comments.map((comment) => { return _.pick(comment, ["id", "content", "user"]) })
        }
    }

    getRecipeList(userId) {
        const recipes = _.cloneDeep(data.recipes);

        for (const recipe of recipes) {
            recipe.user = _.pick(this.#getUserById(recipe.userId), ["id", "name", "surname"]);
            recipe.avgRating = this.#getAvgRatingByRecipeId(recipe.id);

            if (userId !== null && userId !== undefined) {
                recipe.favourite = data.bookmarks.find(bookmark => bookmark.userId === userId && bookmark.recipeId === recipe.id);
            }
        }

        return recipes.map(recipe => { return _.pick(recipe, ["id", "previewBase64", "title", "user", "avgRating", "favourite"]) });
    }
}