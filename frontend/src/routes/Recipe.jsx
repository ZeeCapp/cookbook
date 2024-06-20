import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";

import colors from "../colors";
import Comments from "../components/Comments";
import { axiosContext } from "../contexts/axiosContext";
import { userContext } from "../contexts/userContext";

function Layout() {
  const [recipe, setRecipe] = useState();
  const [loading, setLoading] = useState(true);
  const params = useParams();

  const axios = useContext(axiosContext);
  const { user } = useContext(userContext).user;

  useEffect(() => {
    setLoading(true);

    console.log(user);

    axios
      .get(`/recipe/${params.id}`)
      .then((result) => {
        setLoading(false);
        if (result.data) setRecipe(result.data);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, [axios, params.id]);

  return (
    <>
      {loading && <Spinner></Spinner>}
      {recipe && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Navbar style={{ backgroundColor: colors.accentMedium }}>
            <Container fluid="sm">
              <Navbar.Brand
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <Link
                  to={"/"}
                  style={{ color: "inherit", display: "flex", alignItems: "center" }}
                >
                  <i
                    className="bi bi-arrow-left-circle-fill"
                    style={{ marginRight: "5px", fontSize: "25px", color: "inherit" }}
                  ></i>
                  Back
                </Link>
                {(user.role === "admin" || user.id === recipe.user.id) && (
                  <Link to={`/create/${params.id}`}>
                    <i
                      className="bi bi-pencil"
                      style={{ fontSize: "25px", color: colors.primaryDark }}
                    ></i>
                  </Link>
                )}
              </Navbar.Brand>
            </Container>
          </Navbar>
          <Container style={{ padding: "15px 5px 15px 5px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={`data:image/jpg;base64,${recipe.previewBase64}`}
                style={{ width: "100%", maxWidth: "700px" }}
                alt="preview"
              ></img>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <h2>{recipe.title}</h2>
              <h6 style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div>
                  <strong>Autor:</strong>
                </div>
                <div>{`${recipe.user.name} ${recipe.user.surname}`}</div>
              </h6>
            </div>
            <div
              className="star4"
              style={{ display: "flex", gap: 5 }}
            >
              <i
                className="bi bi-star-fill"
                style={{ fontSize: "20px", cursor: "pointer" }}
              ></i>
              <i
                className="bi bi-star-fill"
                style={{ fontSize: "20px", cursor: "pointer" }}
              ></i>
              <i
                className="bi bi-star-fill"
                style={{ fontSize: "20px", cursor: "pointer" }}
              ></i>
              <i
                className="bi bi-star-fill"
                style={{ fontSize: "20px", cursor: "pointer" }}
              ></i>
              <i
                className="bi bi-star-fill"
                style={{ fontSize: "20px", cursor: "pointer" }}
              ></i>
            </div>
            <div>
              <h5>Ingredience:</h5>
              <Table
                striped
                bordered
              >
                <thead>
                  <tr>
                    <th>Ingredience</th>
                    <th>Množství</th>
                  </tr>
                </thead>
                <tbody>
                  {recipe.ingredients.map((ingredient) => {
                    return (
                      <tr key={ingredient.id}>
                        <td>{ingredient.title}</td>
                        <td>{ingredient.content}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
            <div dangerouslySetInnerHTML={{ __html: recipe.contentHTML }}></div>
            <Comments
              comments={recipe.comments}
              onCommentSubmit={uploadComment}
            ></Comments>
          </Container>
        </div>
      )}
    </>
  );

  function uploadComment(text) {
    axios
      .post(`/comment/${params.id}/${encodeURI(text)}`)
      .then((result) => {
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

export default Layout;
