import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList";
import AddEditProduct from "./pages/AddEditProduct";
import NotFound from "./pages/NotFound";

function App() {
  useEffect(() => {
    document.title = "Product Management System";
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/add" element={<AddEditProduct />} />
        <Route path="/product/edit/:id" element={<AddEditProduct />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
