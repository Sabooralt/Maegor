import { LoadingSpinner } from "@/loading/LoadingSpinner";
import { useEffect, useReducer, createContext } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
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
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "LOGIN", payload: user }); 
    } else {
      dispatch({ type: "LOGIN", payload: null }); 
    }
  }, []);

  if (state.loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ ...state, dispatch, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
