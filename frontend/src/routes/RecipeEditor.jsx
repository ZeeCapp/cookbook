import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

import { axiosContext } from "../contexts/axiosContext";
import Spinner from "react-bootstrap/esm/Spinner";

function RecipeEditor() {
  const [recipe, setRecipe] = useState();
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef();

  const params = useParams();

  const navigate = useNavigate();

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
            if (result.data) {
              result.data.contentHTML = formatHTML(result.data.contentHTML);
              setRecipe(result.data);
            }
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
          <div
            style={{
              width: 400,
              height: 400,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "100%",
              border: "3px solid black",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
            onClick={openPicturePickerDialog}
          >
            <i
              className="bi bi-camera"
              style={{ fontSize: "100px", color: "inherit" }}
            ></i>
            <input
              type="file"
              style={{ display: "none" }}
              ref={fileInputRef}
              accept="image/png"
              onChange={updatePicture}
            ></input>
            {recipe.previewBase64 && (
              <img
                src={`data:image/png;base64,${recipe.previewBase64}`}
                alt="image"
                style={{ position: "absolute", width: "100%", height: "100%", zIndex: -1, objectFit: "cover" }}
              />
            )}
          </div>
          <div style={{ width: "100%" }}>
            <strong>Název receptu:</strong>
            <Form.Control
              type="text"
              id="recipeTitle"
              value={recipe.title}
              onChange={updateTitle}
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
                      <td>
                        <Form.Control
                          type="text"
                          id="ingredientTitle"
                          value={ingredient.title}
                          onChange={(ev) => {
                            updateIngredientTitle(ingredient.id, ev);
                          }}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          id="ingredientContent"
                          value={ingredient.content}
                          onChange={(ev) => {
                            updateIngredientContent(ingredient.id, ev);
                          }}
                        />
                      </td>
                      <td style={{ display: "flex", justifyContent: "center" }}>
                        <Button
                          variant="danger"
                          onClick={() => {
                            deleteIngredient(ingredient.id);
                          }}
                        >
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
                      <Button
                        variant="success"
                        onClick={addIngredient}
                      >
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
            onChange={updateContent}
          ></textarea>
          <Button
            variant="primary"
            onClick={postRecipe}
          >
            Uložit
          </Button>
        </div>
      )}
    </Container>
  );

  function updateTitle(event) {
    console.log(event);
    setRecipe((prevState) => {
      return {
        ...prevState,
        ...{
          title: event.target.value,
        },
      };
    });
  }

  function updateContent(event) {
    setRecipe((prevState) => {
      return {
        ...prevState,
        ...{
          contentHTML: event.target.value,
        },
      };
    });
  }

  function addIngredient() {
    setRecipe((prevState) => {
      return {
        ...prevState,
        ...{
          ingredients: [
            ...prevState.ingredients,
            {
              id: Math.max(0, ...prevState.ingredients.map((ingredient) => ingredient.id)) + 1,
              title: "",
              content: "",
            },
          ],
        },
      };
    });
  }

  function deleteIngredient(id) {
    setRecipe((prevState) => {
      return {
        ...prevState,
        ...{
          ingredients: prevState.ingredients.filter((ingredient) => ingredient.id !== id),
        },
      };
    });
  }

  function updateIngredientTitle(index, event) {
    setRecipe((prevState) => {
      prevState.ingredients.find((ingredient) => ingredient.id === index).title = event.target.value;
      return {
        ...prevState,
        ...{
          ingredients: prevState.ingredients,
        },
      };
    });
  }

  function updateIngredientContent(index, event) {
    setRecipe((prevState) => {
      prevState.ingredients.find((ingredient) => ingredient.id === index).content = event.target.value;
      return {
        ...prevState,
        ...{
          ingredients: prevState.ingredients,
        },
      };
    });
  }

  function openPicturePickerDialog() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function updatePicture(ev) {
    if (ev.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRecipe((prevState) => {
          return {
            ...prevState,
            ...{
              previewBase64: reader.result.split(",")[1],
            },
          };
        });
      };
      reader.readAsDataURL(ev.target.files[0]);
    }
  }

  function formatHTML(html) {
    var tab = "    ";
    var result = "";
    var indent = "";

    html.split(/>\s*</).forEach(function (element) {
      if (element.match(/^\/\w/)) {
        indent = indent.substring(tab.length);
      }

      result += indent + "<" + element + ">\r\n";

      if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input")) {
        indent += tab;
      }
    });

    return result.substring(1, result.length - 3);
  }

  function postRecipe() {
    if (params.idOrNew === "new") {
      axios
        .post("/recipe", recipe)
        .then((result) => {
          console.log(result);
          navigate(`/recipe/${result.data.id}`);
        })
        .catch((err) => {
          window.alert(err);
        });
    } else {
      axios
        .patch(`/recipe/${params.idOrNew}`, recipe)
        .then((result) => {
          console.log(result);
          navigate(`/recipe/${params.idOrNew}`);
        })
        .catch((err) => {
          window.alert(err);
        });
    }
  }
}

export default RecipeEditor;
