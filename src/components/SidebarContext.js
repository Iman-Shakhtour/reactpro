import { createContext, useReducer, useContext } from "react";
import PropTypes from "prop-types";

/* ----- reducer ----- */
const sidebarReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    case "SET_SIDEBAR_OPEN":
      return { ...state, isSidebarOpen: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

/* ----- initial state ----- */
const initialState = { isSidebarOpen: window.innerWidth > 1200 };

/* ----- context & provider ----- */
export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sidebarReducer, initialState);

  const toggleSidebar  = () => dispatch({ type: "TOGGLE_SIDEBAR" });
  const setSidebarOpen = v => dispatch({ type: "SET_SIDEBAR_OPEN", payload: v });

  const value = { ...state, toggleSidebar, setSidebarOpen };
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

SidebarProvider.propTypes = { children: PropTypes.node };

export const useSidebar = () => useContext(SidebarContext);
