import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

import { axiosContext } from "../contexts/axiosContext";
import Spinner from "react-bootstrap/esm/Spinner";

function RecipeEditor() {
  const [recipe, setRecipe] = useState();
  const [loading, setLoading] = useState(false);

  const params = useParams();

  const axios = useContext(axiosContext);

  useEffect(() => {
    if (params.idOrNew) {
      if (params.idOrNew === "new") {
        setRecipe({
          title: "",
          previewBase64: "",
          contentHTML: "",
          ingredients: [],
        });
      } else if (
        typeof Number.parseInt(params.idOrNew) === "number" &&
        isNaN(Number.parseInt(params.idOrNew)) === false
      ) {
        setLoading(true);
        axios
          .get(`/recipe/${params.idOrNew}`)
          .then((result) => {
            setLoading(false);
            if (result.data) setRecipe(result.data);
          })
          .catch((err) => {
            setLoading(false);
            console.error(err);
          });
      }
    }
  }, [axios, params.idOrNew]);

  return (
    <Container>
      {loading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Spinner></Spinner>
        </div>
      )}
      {recipe && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 15, padding: 15 }}>
          <div style={{ width: "100%" }}>
            <strong>Název receptu:</strong>
            <Form.Control
              type="text"
              id="recipeName"
              aria-describedby="passwordHelpBlock"
              value={recipe.title}
            />
          </div>
          <div style={{ width: "100%" }}>
            <strong>Ingredience:</strong>
            <Table
              striped
              bordered
            >
              <thead>
                <tr>
                  <th>Ingredience</th>
                  <th>Množství</th>
                  <th>Akce</th>
                </tr>
              </thead>
              <tbody>
                {recipe.ingredients.map((ingredient) => {
                  return (
                    <tr key={ingredient.id}>
                      <td>{ingredient.title}</td>
                      <td>{ingredient.content}</td>
                      <td style={{ display: "flex", justifyContent: "center" }}>
                        <Button variant="danger">
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                              gap: 5,
                              alignItems: "center",
                            }}
                          >
                            <i
                              className="bi bi-x"
                              style={{ fontSize: "25px", color: "inherit" }}
                            ></i>
                            Odebrat
                          </div>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan={3}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Button variant="success">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            gap: 5,
                            alignItems: "center",
                          }}
                        >
                          <i
                            className="bi bi-plus"
                            style={{ fontSize: "25px", color: "inherit" }}
                          ></i>
                          Přidat ingredienci
                        </div>
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div style={{ width: "100%" }}>
            <strong>Obsah:</strong>
          </div>
          <textarea
            value={recipe.contentHTML}
            style={{ width: "100%", minHeight: "300px" }}
          ></textarea>
          <Button variant="primary">Uložit</Button>
        </div>
      )}
    </Container>
  );
}

export default RecipeEditor;
