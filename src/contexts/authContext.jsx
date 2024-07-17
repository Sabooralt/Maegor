import { LoadingSpinner } from "@/loading/LoadingSpinner";
import { useEffect, useReducer, createContext, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case "UPDATE_DETAILS":
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
  });

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axiosInstance
        .get("/user/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          dispatch({
            type: "LOGIN",
            payload: { user: response.data, token },
          });
        })
        .catch(() => {
          localStorage.removeItem("token");
          dispatch({ type: "LOGOUT" });
        });
    } else {
      dispatch({ type: "LOGIN", payload: { user: null, token: null } });
    }
  }, []);

  if (state.loading) {
    return <LoadingSpinner />;
  }

  console.log("AuthContext state: ", state);
  return (
    <AuthContext.Provider value={{ ...state, dispatch, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error("useAuthContext must be used inside an AuthContextProvider");
  }
  return context;
};
