import { createContext, useContext, useLayoutEffect } from "react";

import { userContext } from "./userContext";

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5001",
});

function useAuthInterceptor() {
  const { user, setUser } = useContext(userContext);

  useLayoutEffect(() => {
    const authReqInterceptor = axiosInstance.interceptors.request.use((req) => {
      if (user) req.headers["Authorization"] = `Bearer ${user.token}`;

      return req;
    });

    const authResInterceptor = axiosInstance.interceptors.response.use(null, (err) => {
      if (err.response.status === 401) {
        setUser();
        window.location.href = "/login";
      }

      return Promise.reject(err);
    });

    return () => {
      axiosInstance.interceptors.request.eject(authReqInterceptor);
      axiosInstance.interceptors.response.eject(authResInterceptor);
    };
  }, [user, setUser]);
}

const axiosContext = createContext(axiosInstance);

export { axiosContext, useAuthInterceptor };
