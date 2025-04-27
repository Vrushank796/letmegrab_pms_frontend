import React, { useState } from "react";
import "./FilterForm.css";

const FilterForm = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    SKU: "",
    product_name: "",
    category: "",
    material: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  return (
    <form className="filter-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="SKU"
        placeholder="Filter by SKU"
        value={filters.SKU}
        onChange={handleChange}
      />
      <input
        type="text"
        name="product_name"
        placeholder="Filter by Product Name"
        value={filters.product_name}
        onChange={handleChange}
      />
      <input
        type="text"
        name="category"
        placeholder="Filter by Category"
        value={filters.category}
        onChange={handleChange}
      />
      <input
        type="text"
        name="material"
        placeholder="Filter by Material"
        value={filters.material}
        onChange={handleChange}
      />
      <input
        type="number"
        name="min_price"
        placeholder="Min Price"
        value={filters.min_price}
        onChange={handleChange}
      />

      <input
        type="number"
        name="max_price"
        placeholder="Max Price"
        value={filters.max_price}
        onChange={handleChange}
      />
      <button type="submit" className="apply-button">
        Apply Filters
      </button>
    </form>
  );
};

export default FilterForm;
