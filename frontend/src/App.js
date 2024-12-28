import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import {LoginPage,  SignupPage,Home, CreateProduct,MyProducts} from "./Routes.js";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        {/* For new product */}
        <Route path="/create-product" element={<CreateProduct />} />
        {/* For edit product by id */}
        <Route path="/create-product/:id" element={<CreateProduct />} />
        {/* For viewing the user’s products */}
        <Route path="/my-products" element={<MyProducts />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App