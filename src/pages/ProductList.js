import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import FilterForm from "../components/FilterForm";
import { useNavigate } from "react-router-dom";
import "./ProductList.css";

const ProductsList = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    SKU: "",
    product_name: "",
    category: "",
    material: "",
    min_price: "",
    max_price: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 6;
  const [filteredProducts, setFilteredProducts] = useState([]);

  // State to store the fetched statistics
  const [highestPrice, setHighestPrice] = useState([]);
  const [priceRange, setPriceRange] = useState([]);
  const [noMediaProducts, setNoMediaProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/products`
        );
        setProducts(response.data); // Save all products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Apply filters + search
    let filtered = products.filter((product) => {
      const minPrice =
        filters.min_price === "" ? null : Number(filters.min_price);
      const maxPrice =
        filters.max_price === "" ? null : Number(filters.max_price);
      return (
        (filters.SKU === "" || product.SKU.includes(filters.SKU)) &&
        (filters.product_name === "" ||
          product.product_name
            .toLowerCase()
            .includes(filters.product_name.toLowerCase())) &&
        (filters.category === "" ||
          product.category_name
            .toLowerCase()
            .includes(filters.category.toLowerCase())) &&
        (filters.material === "" ||
          product.materials
            .toLowerCase()
            .includes(filters.material.toLowerCase())) &&
        // Add price filter range logic
        (minPrice === null || product.price >= minPrice) &&
        (maxPrice === null || product.price <= maxPrice)
      );
    });

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
    setPage(1); // Reset to first page if filters change
  }, [products, filters, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleDeleteSuccess = (deletedProductId) => {
    // Remove the deleted product from the list
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.product_id !== deletedProductId)
    );
  };

  // Fetch statistics on component mount
  useEffect(() => {
    // Fetch highest price per category
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/statistics/highest-price`)
      .then((response) => setHighestPrice(response.data))
      .catch((error) => console.error("Error fetching highest price:", error));

    // Fetch price range count
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/statistics/price-range`)
      .then((response) => setPriceRange(response.data))
      .catch((error) =>
        console.error("Error fetching price range count:", error)
      );

    // Fetch products without media
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/statistics/no-media`)
      .then((response) => setNoMediaProducts(response.data))
      .catch((error) =>
        console.error("Error fetching products with no media:", error)
      );
  }, []);

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Product List</h1>
        <button
          className="add-product-button"
          onClick={() => navigate("/product/add")}
        >
          + Add Product
        </button>
      </div>

      <div className="search-filter-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterForm onFilterChange={handleFilterChange} />
      </div>

      {paginatedProducts.length === 0 ? (
        <div className="no-products">No products found</div>
      ) : (
        <div className="product-list">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              onDeleteSuccess={handleDeleteSuccess}
            />
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      <h1>Product Statistics:</h1>

      {/* Display highest price per category */}
      <div className="stat-card">
        <h2>Highest Price by Category</h2>
        {highestPrice.length > 0 ? (
          highestPrice.map((item, index) => (
            <div key={index}>
              <p>
                {item.category_name}: ₹{item.highest_price}
              </p>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* Display product count by price range */}
      <div className="stat-card">
        <h2>Product Count by Price Range</h2>
        {priceRange.length > 0 ? (
          priceRange.map((item, index) => (
            <div key={index}>
              <p>
                {item.price_range}: {item.product_count} products
              </p>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* Display products with no media */}
      <div className="stat-card">
        <h2>Products Without Media</h2>
        {noMediaProducts.length > 0 ? (
          noMediaProducts.map((product, index) => (
            <div key={index}>
              <p>{product.product_name}</p>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ProductsList;
