import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import colors from "../colors";
import { axiosContext } from "../contexts/axiosContext";

function Layout() {
  const [recipe, setRecipe] = useState();
  const [loading, setLoading] = useState(true);
  const params = useParams();

  console.log(params);

  const axios = useContext(axiosContext);

  useEffect(() => {
    setLoading(true);

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
  }, [axios]);

  return (
    <>
      {loading && <Spinner></Spinner>}
      {recipe && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Navbar style={{ backgroundColor: colors.accentMedium }}>
            <Container>
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
                  ></i>{" "}
                  Back
                </Link>
                {recipe.title}
              </Navbar.Brand>
            </Container>
          </Navbar>
        </div>
      )}
    </>
  );
}

export default Layout;
