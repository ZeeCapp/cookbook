import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { useContext } from "react";

import { axiosContext } from "../contexts/axiosContext";
import colors from "../colors";

function RecipeList({ recipes }) {
  const axios = useContext(axiosContext);

  return (
    <Container>
      <div className="recipes-container">
        {recipes.map((recipe) => {
          return (
            <Link
              to={`/recipe/${recipe.id}`}
              key={recipe.id}
              className="recipe"
            >
              <Card style={{ width: "100%", height: "100%" }}>
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
    </Container>
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
