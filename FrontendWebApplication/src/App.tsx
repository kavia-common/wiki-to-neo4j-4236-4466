import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./styles.css";

/**
 * Root App component with routing. Currently single-page with Home route.
 */

// PUBLIC_INTERFACE
export default function App() {
  /** Application entry rendering the Home page. */
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
