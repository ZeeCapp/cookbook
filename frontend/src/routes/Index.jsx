import { useState, useEffect, useContext } from "react";
import { axiosContext } from "../contexts/axiosContext";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/esm/Spinner";

import colors from "../colors";

function RecipeList() {
  const [recipes, setRecipes] = useState();
  const [loading, setLoading] = useState(true);

  const axios = useContext(axiosContext);

  useEffect(() => {
    setLoading(true);

    axios
      .get("/recipe")
      .then((result) => {
        setLoading(false);
        if (result.data) setRecipes(result.data);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, [axios]);

  return (
    <>
      {loading && (
        <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spinner></Spinner>
        </div>
      )}
      {recipes && (
        <div className="recipes-container">
          {recipes.map((recipe) => {
            return (
              <Link
                to={`/recipe/${recipe.id}`}
                key={recipe.id}
                className="recipe"
              >
                <Card>
                  <Card.Img
                    variant="top"
                    src={`data:image/jpg;base64,${recipe.previewBase64}`}
                  />
                  <Card.Body>
                    <Card.Title style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>{recipe.title}</div>
                      <span
                        style={{
                          padding: "5px 10px 5px 10px",
                          backgroundColor: colors.primaryMedium,
                          borderRadius: "5px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          recipe.bookmarked ? removeBookmark(recipe.id) : bookmark(recipe.id);
                        }}
                      >
                        <i
                          className="bi bi-star-fill"
                          style={{ fontSize: "20px", color: recipe.bookmarked ? "yellow" : "white" }}
                        ></i>
                      </span>
                    </Card.Title>
                  </Card.Body>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 15px 5px 15px" }}>
                    <div>{`${recipe.user.name} ${recipe.user.surname}`}</div>
                    <div style={{ display: "flex", alignItems: "center" }}>Hodnocení: {recipe.avgRating}</div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );

  function removeBookmark(id) {
    axios
      .delete(`/bookmark/${id}`)
      .then((result) => {
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function bookmark(id) {
    axios
      .post(`/bookmark/${id}`)
      .then((result) => {
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

export default RecipeList;
