import { createContext, useContext, useEffect } from "react";

import { userContext } from "./userContext";

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5001",
});

function useAuthInterceptors() {
  const { user, setUser } = useContext(userContext);

  useEffect(() => {
    const authReqInterceptor = axiosInstance.interceptors.request.use((req) => {
      if (user) req.headers["Authorization"] = `Bearer ${user.token}`;

      return req;
    });

    const authResInterceptor = axiosInstance.interceptors.response.use(null, (err) => {
      if (err.response.status === 401 && user !== null) {
        setUser(null);

        if(window.location.href.includes("/auth/login") === false) window.location.href = "/login";
      }
        

      return Promise.reject(err);
    });

    return () => {
      axiosInstance.interceptors.request.eject(authReqInterceptor); // remove interceptor on dismount/auth change
      axiosInstance.interceptors.response.eject(authResInterceptor);
    };
  }, [user]);
}

const axiosContext = createContext(axiosInstance);

export { axiosContext, useAuthInterceptors as useAuthInterceptor };
