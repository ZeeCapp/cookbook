import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/css/bootstrap.css";

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Login from "./routes/Login";
import { userContext } from "./contexts/userContext";
import { useAuthInterceptor } from "./contexts/axiosContext";
import Layout from "./routes/Layout";
import RecipeList from "./routes/Index";
import Recipe from "./routes/Recipe";
import Bookmarks from "./routes/Bookmarks";
import RecipeEditor from "./routes/RecipeEditor";

function AxiosInterceptorProvider({ children }) {
  useAuthInterceptor();

  return children;
}

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  return (
    <BrowserRouter>
      <userContext.Provider value={{ user, setUser }}>
        <AxiosInterceptorProvider>
          <Routes>
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/recipe/:id"
              element={<Recipe />}
            />
            <Route
              path="/"
              element={<Layout />}
            >
              <Route
                index
                element={<RecipeList />}
              ></Route>
              <Route
                path="/bookmarks"
                element={<Bookmarks />}
              ></Route>
              <Route
                path="/create/:idOrNew"
                element={<RecipeEditor />}
              ></Route>
            </Route>
          </Routes>
        </AxiosInterceptorProvider>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;
