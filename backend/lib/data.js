export default {
    roles: [
        {
            id: 1,
            role: "user"
        },
        {
            id: 2,
            role: "admin"
        }
    ],
    users: [
        {
            id: 1,
            name: "Jan",
            surname: "Ligač",
            email: "admin@test.cz",
            roleId: 2
        },
        {
            id: 2,
            name: "John",
            surname: "doe",
            email: "user@test.cz",
            roleId: 1
        }
    ],
    recipes: [
        {
            id: 1,
            userId: 1,
            title: "Bábovka",
            previewBase64: "",
            contentHTML: ""
        }
    ],
    ingredients: [
        {
            id: 1,
            recipeId: 1,
            title: "vejce",
            content: "2ks"
        },
        {
            id: 2,
            recipeId: 1,
            title: "rostlinný olej",
            content: "půl hrnku"
        },
        {
            id: 3,
            recipeId: 1,
            title: "mléko",
            content: "hrnek"
        },
        {
            id: 4,
            recipeId: 1,
            title: "vanilkový cukr",
            content: "1 balení"
        },
        {
            id: 5,
            recipeId: 1,
            title: "polohrubá mouka",
            content: "2 hrnky"
        },
        {
            id: 6,
            recipeId: 1,
            title: "prášek do pečiva",
            content: "1 balení"
        },
        {
            id: 7,
            recipeId: 1,
            title: "kakao",
            content: "1 lžíce"
        },
        {
            id: 8,
            recipeId: 1,
            title: "cukr krupice",
            content: "1 hrnek"
        },
    ],
    comments: [
        {
            id: 1,
            userId: 2,
            recipeId: 1,
            content: "Nice recipe!"
        },
        {
            id: 2,
            userId: 1,
            recipeId: 1,
            content: "Test"
        }
    ],
    ratings: [
        {
            id: 1,
            userId: 2,
            recipeId: 1,
            value: 4.5
        }
    ],
    bookmarks: [
        {
            id: 1,
            userId: 1,
            recipeId: 1
        },
        {
            id: 2,
            userId: 2,
            recipeId: 1
        }
    ]
}