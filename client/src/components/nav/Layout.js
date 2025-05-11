import React from "react";
import Footer from "./Footer"; 
import { useLocation } from "react-router-dom";
import "./Layout.css";

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="layout">
      {children}
      {location.pathname !== "/" && <Footer />}
    </div>
  );
}