import { useState, useEffect, useContext } from "react";
import { axiosContext } from "../contexts/axiosContext";
import Spinner from "react-bootstrap/esm/Spinner";

import RecipeList from "../components/RecipeList";

function Bookmarks() {
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
      {recipes && <RecipeList recipes={recipes} />}
    </>
  );
}

export default Bookmarks;
