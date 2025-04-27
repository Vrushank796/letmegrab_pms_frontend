import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./AddEditProduct.css";
import { House } from "lucide-react";

const AddEditProduct = () => {
  const [product, setProduct] = useState({
    SKU: "",
    product_name: "",
    category_id: "",
    price: "",
    materials: [],
    image_urls: [],
  });

  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, materialsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/categories`),
          axios.get(`${process.env.REACT_APP_API_URL}/materials`),
        ]);
        setCategories(categoriesRes.data);
        setMaterials(materialsRes.data);
      } catch (error) {
        console.error("Error fetching categories/materials:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/products/${id}`
          );

          // Assuming the API returns a product object with materials as an string of IDs and image_urls as an string of urls
          const productData = response.data;

          // Convert materials to an array of strings
          const materialsArray = productData.materials
            ? productData.materials.split(",").map((mat) => mat.trim())
            : [];
          // Convert image_urls to an array of strings
          const imageUrlsArray = productData.image_urls
            ? productData.image_urls.split(",").map((url) => url.trim())
            : [];

          // Set the product state with the fetched data
          setProduct({
            ...productData,
            materials: materialsArray,
            image_urls: imageUrlsArray,
          });
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      };
      fetchProduct();
    }
  }, [id]);

  // console.log("Product ID:", id);
  // console.log("Product Data:", product);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleMaterialChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setProduct((prev) => ({
        ...prev,
        materials: [...prev.materials, value],
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        materials: prev.materials.filter((mat) => mat !== value),
      }));
    }
  };

  const handleImageUrlChange = (e, index) => {
    const { value } = e.target;
    const updatedImageUrls = [...product.image_urls];
    updatedImageUrls[index] = value;
    setProduct((prev) => ({ ...prev, image_urls: updatedImageUrls }));
  };

  const handleAddImageUrl = () => {
    setProduct((prev) => ({ ...prev, image_urls: [...prev.image_urls, ""] }));
  };

  const handleRemoveImageUrl = (index) => {
    const updatedImageUrls = product.image_urls.filter((_, i) => i !== index);
    setProduct((prev) => ({ ...prev, image_urls: updatedImageUrls }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(product);

    try {
      if (id) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/products/${id}`,
          product
        );
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/products`, product);
        setProduct({
          SKU: "",
          product_name: "",
          category_id: "",
          price: "",
          materials: [],
          image_urls: [],
        });
      }

      alert("Product saved successfully!");

      navigate("/");
    } catch (error) {
      console.error("Error saving product:", error);

      alert("Failed to save product. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <button onClick={() => navigate("/")} className="button">
        <House size={18} /> Back to Product List
      </button>
      <h1>{id ? "Edit Product" : "Add Product"}</h1>
      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          name="SKU"
          value={product.SKU}
          onChange={handleInputChange}
          placeholder="SKU"
          required
        />
        <input
          type="text"
          name="product_name"
          value={product.product_name}
          onChange={handleInputChange}
          placeholder="Product Name"
          required
        />
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleInputChange}
          placeholder="Price"
          required
        />

        <select
          name="category_id"
          value={product.category_id}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.category_name}
            </option>
          ))}
        </select>

        <div className="materials-section">
          <label>Select Materials:</label>
          {materials.map((mat) => (
            <div key={mat.material_id}>
              <input
                type="checkbox"
                value={mat.material_id}
                checked={product.materials.includes(String(mat.material_id))}
                onChange={handleMaterialChange}
              />
              {mat.material_name}
            </div>
          ))}
        </div>

        <div className="image-urls-section" style={{ marginBottom: "20px" }}>
          <label>Image URLs:</label>
          {product.image_urls.map((url, index) => (
            <div key={index} style={{ width: "100%" }}>
              <input
                type="text"
                value={url}
                onChange={(e) => handleImageUrlChange(e, index)}
                placeholder="Image URL"
                style={{ width: "80%" }}
              />
              <button type="button" onClick={() => handleRemoveImageUrl(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddImageUrl}>
            Add Image URL
          </button>
        </div>

        <button type="submit" className="my-4">
          {id ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddEditProduct;
