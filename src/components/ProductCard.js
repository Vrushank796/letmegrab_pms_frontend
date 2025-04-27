import React from "react";
import Slider from "react-slick"; // Image slider library
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./ProductCard.css";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios";

const ProductCard = ({ product, onDeleteSuccess }) => {
  const navigate = useNavigate();

  const images =
    product?.image_urls === null
      ? [
          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        ]
      : Array.isArray(product?.image_urls)
      ? product?.image_urls
      : product?.image_urls?.split(",");

  const sliderSettings = {
    dots: true, // Show dots below images
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/products/${id}`
      );
      if (response.status === 200) {
        alert("Product deleted successfully");

        if (onDeleteSuccess) {
          onDeleteSuccess(id); // pass the deleted product ID back to parent
        }
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="product-card">
      {" "}
      {/* Image Slider */}
      {/* Image Slider */}
      <div className="product-images">
        {images.length > 1 ? (
          <Slider {...sliderSettings}>
            {images.map((url, index) => (
              <div key={index}>
                <img
                  src={url}
                  alt={`Product ${product.product_name}`}
                  className="product-image"
                />
              </div>
            ))}
          </Slider>
        ) : (
          <img
            src={images[0]}
            alt={`Product ${product.product_name}`}
            className="product-image"
          />
        )}
      </div>
      {/* Product Info */}
      <div className="product-info">
        <h2 className="product-title">{product.product_name}</h2>
        <p>
          <strong>SKU:</strong> {product.SKU}
        </p>
        <p>
          <strong>Category:</strong> {product.category_name}
        </p>
        <p>
          <strong>Price:</strong> Rs. {product.price}
        </p>
        <p>
          <strong>Materials:</strong> {product.materials}
        </p>
        <div className="card-actions">
          <button
            className="edit-button"
            onClick={() => navigate(`/product/edit/${product.product_id}`)}
          >
            Edit
          </button>
          <button
            className="delete-button"
            onClick={() => handleDelete(product.product_id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
