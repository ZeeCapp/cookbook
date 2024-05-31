import "bootstrap/dist/css/bootstrap.min.css";

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Login from "./routes/Login";
import { userContext } from "./contexts/userContext";
import { useAuthInterceptor } from "./contexts/axiosContext";

function AxiosInterceptorProvider({ children }) {
  useAuthInterceptor();

  return children;
}

function App() {
  const [user, setUser] = useState({ token: "test" });
  return (
    <userContext.Provider value={{ user, setUser }}>
      <AxiosInterceptorProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={<Login />}
            />
          </Routes>
        </BrowserRouter>
      </AxiosInterceptorProvider>
    </userContext.Provider>
  );
}

export default App;
