import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" style={{ color: "#007bff", textDecoration: "none" }}>
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
