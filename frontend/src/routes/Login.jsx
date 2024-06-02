import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import PrimaryButton from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

import { axiosContext } from "../contexts/axiosContext";
import { userContext } from "../contexts/userContext";
import colors from "../colors";

function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const axios = useContext(axiosContext);
  const { setUser } = useContext(userContext);

  return (
    <div style={{ height: "100vh" }}>
      <Navbar style={{ backgroundColor: colors.accentMedium }}>
        <Container>
          <Navbar.Brand>Cookbok</Navbar.Brand>
        </Container>
      </Navbar>

      <Container style={{ height: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
          <FloatingLabel
            controlId="floatingInput"
            label="Email address"
            className="mb-3"
          >
            <Form.Control
              type="email"
              placeholder="name@example.com"
              onInput={(e) => {
                setEmail(e.target.value);
              }}
            />
          </FloatingLabel>
          <Alert variant="info">
            Pro základní přihlášení použijte email <strong>admin@test.cz</strong>
          </Alert>
          <div className="d-flex justify-content-center">
            <PrimaryButton onClick={login}>Login</PrimaryButton>
          </div>
          {loading && (
            <div
              className="d-flex justify-content-center"
              style={{ marginTop: "15px" }}
            >
              <Spinner></Spinner>
            </div>
          )}
        </div>
      </Container>
    </div>
  );

  function login() {
    setLoading(true);

    axios
      .get(`/auth/login?login=${email}`)
      .then((result) => {
        setLoading(false);

        if (result?.data?.token) {
          const decodedeString = decodeURIComponent(
            atob(result.data.token)
              .split("")
              .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join("")
          );

          setUser({
            token: result.data.token,
            user: JSON.parse(decodedeString),
          });

          localStorage.setItem(
            "user",
            JSON.stringify({
              token: result.data.token,
              user: JSON.parse(decodedeString),
            })
          );
          navigate("/");
        }
      })
      .catch((err) => {
        setLoading(false);
        window.alert(JSON.stringify(err?.response?.data) || err);
      });
  }
}

export default Login;
