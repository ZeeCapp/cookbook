import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import PrimaryButton from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Spinner from "react-bootstrap/Spinner";

import { axiosContext } from "../contexts/axiosContext";
import { userContext } from "../contexts/userContext";
import colors from "../colors";

function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const axios = useContext(axiosContext);
  const { user, setUser } = useContext(userContext);

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
          setUser(result.data);
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
