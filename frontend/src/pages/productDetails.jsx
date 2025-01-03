// ProductDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Nav from "../components/nav";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v2/product/product/${id}`);
                    console.log("Fetched product:", response.data.product);
                setProduct(response.data.product); // Ensure correct state setting
                setLoading(false);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError(err);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Log the updated product state whenever it changes
    useEffect(() => {
        if (product !== null) {
            console.log("Updated product state:", product);
            console.log("Product name:", product.name);
        }
    }, [product]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-xl">Error: {error.message}</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500 text-xl">No product found.</div>
            </div>
        );
    }

    return (
        <>
            <Nav />
            <div className="container mx-auto p-6">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="md:flex">
                        {/* Image Section */}
                        <div className="md:w-1/2">
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={`http://localhost:8000${product.images[0]}`}
                                alt = { product.name }
                                    className="w-full h-full object-cover"
                            style={{ maxHeight: '500px' }} // Adjust the max height as needed
                                />
                            ) : (
                            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                                No Image Available
                            </div>
                            )}
                        </div>

                        {/* Information Section */}
                        <div className="md:w-1/2 p-6">
                            <h1 className="text-3xl font-semibold mb-4 text-gray-800">{product.name}</h1>

                            <div className="mb-4">
                                <h2 className="text-xl font-medium text-gray-700">Description</h2>
                                <p className="text-gray-600 mt-2">{product.description}</p>
                            </div>

                            <div className="mb-4">
                                <h2 className="text-xl font-medium text-gray-700">Category</h2>
                                <p className="text-gray-600 mt-2">{product.category}</p>
                            </div>

                            {product.tags && product.tags.length > 0 && (
                                <div className="mb-4">
                                    <h2 className="text-xl font-medium text-gray-700">Tags</h2>
                                    <div className="mt-2 flex flex-wrap">
                                        {product.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <h2 className="text-xl font-medium text-gray-700">Price</h2>
                                <p className="text-gray-600 mt-2 text-lg font-semibold">${product.price}</p>
                            </div>

                            <div className="mb-4">
                                <h2 className="text-xl font-medium text-gray-700">Contact Email</h2>
                                <p className="text-gray-600 mt-2">
                                    <a href={`mailto:${product.email}`} className="text-blue-500 hover:underline">
                                    {product.email}
                                </a>
                            </p>
                        </div>

                        {/* Optional: Add a button or link for further actions */}
                        <div className="mt-6">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
                                Contact Seller
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
        </>
    );
}