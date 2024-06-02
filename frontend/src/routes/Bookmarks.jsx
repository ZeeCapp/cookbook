import { useState, useEffect, useContext } from "react";
import { axiosContext } from "../contexts/axiosContext";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import Spinner from "react-bootstrap/esm/Spinner";

function RecipeList() {
  const [recipes, setRecipes] = useState();
  const [loading, setLoading] = useState(true);

  const axios = useContext(axiosContext);

  useEffect(() => {
    setLoading(true);

    axios
      .get("/recipe/bookmarked")
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
        <div style={{ display: "flex", flexDirection: "column", width: "100%", padding: "10px", gap: "15px" }}>
          {recipes.map((recipe) => {
            return (
              <Link to={`/recipe/${recipe.id}`} key={recipe.id}>
                <Card style={{ width: "100%" }}>
                  <Card.Img
                    variant="top"
                    src={`data:image/jpg;base64,${recipe.previewBase64}`}
                  />
                  <Card.Body>
                    <Card.Title style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>{recipe.title}</div>
                      <Button variant="dark">
                        <i
                          className="bi bi-star-fill"
                          style={{ fontSize: "20px", color: recipe.bookmarked ? "yellow" : "white" }}
                        ></i>
                      </Button>
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
}

export default RecipeList;
