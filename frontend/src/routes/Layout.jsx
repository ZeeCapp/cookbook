import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { userContext } from "../contexts/userContext";
import colors from "../colors";

function Layout() {
  const { user } = useContext(userContext);
  const currentLocation = useLocation();

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Navbar style={{ backgroundColor: colors.accentMedium }}>
          <Container>
            <Navbar.Brand>Cookbook</Navbar.Brand>
            <div>{user?.user?.email}</div>
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
              to={"/create"}
              style={{
                display: "flex",
                alignItems: "center",
                color: currentLocation.pathname === "/create" ? colors.accentDark : "white",
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
}

export default Layout;
