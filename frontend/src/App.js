import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Auth from './components/Auth';
import ProductList from './components/ProductList';
import CreateProduct from './components/CreateProduct';
import ProductDetail from './components/ProductDetail';
import EditProduct from './components/EditProduct';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/create" element={<CreateProduct />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/products/:id/edit" element={<EditProduct />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
