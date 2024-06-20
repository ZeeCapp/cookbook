import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useContext } from "react";

import { userContext } from "../contexts/userContext";
import colors from "../colors";

function Layout() {
  const { user, setUser } = useContext(userContext);
  const currentLocation = useLocation();

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Navbar style={{ backgroundColor: colors.accentMedium }}>
          <Container>
            <Navbar.Brand>
              <Link
                style={{ color: colors.primaryDark }}
                to={"/"}
              >
                Cookbook
              </Link>
            </Navbar.Brand>
            {user && (
              <DropdownButton
                variant="secondary"
                title={user?.user?.email}
              >
                <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
              </DropdownButton>
            )}
          </Container>
        </Navbar>
        <div>
          <Outlet></Outlet>
          <div style={{ width: "100%", height: "50px" }}></div>
        </div>
      </div>
      <div
        style={{
          backgroundColor: colors.primaryLigth,
          height: "50px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          position: "fixed",
          bottom: "0px",
        }}
      >
        <Container>
          <div style={{ display: "flex", justifyContent: "center", gap: "10%" }}>
            <Link
              to={"/create/new"}
              style={{
                display: "flex",
                alignItems: "center",
                color: currentLocation.pathname.includes("/create/new") ? colors.accentDark : "white",
              }}
            >
              <i
                className="bi bi-plus-lg"
                style={{ marginRight: "5px", fontSize: "25px" }}
              ></i>
              Add
            </Link>
            <Link
              to={"/"}
              style={{
                display: "flex",
                alignItems: "center",
                color: currentLocation.pathname === "/" ? colors.accentDark : "white",
              }}
            >
              <i
                className="bi bi-house"
                style={{ marginRight: "5px", fontSize: "20px", marginBottom: "3px" }}
              ></i>
              Home
            </Link>
            <Link
              to={"/bookmarks"}
              style={{
                display: "flex",
                alignItems: "center",
                color: currentLocation.pathname === "/bookmarks" ? colors.accentDark : "white",
              }}
            >
              <i
                className="bi bi-star-fill"
                style={{ marginRight: "5px", fontSize: "20px", marginBottom: "3px" }}
              ></i>
              Bookmarks
            </Link>
          </div>
        </Container>
      </div>
    </>
  );

  function logout() {
    localStorage.clear();
    setUser();
    window.location.pathname = "/login";
  }
}

export default Layout;
