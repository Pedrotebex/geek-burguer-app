import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import MenuPage from './pages/MenuPage';
import MediaPage from './pages/MediaPage';
import BannerManagementPage from './pages/BannerManagementPage'; // <-- Importe a nova página

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<MenuPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rota Pai para a Área de Admin */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Rotas Filhas que renderizam dentro do AdminLayout */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="add-product" element={<AddProductPage />} />
            <Route path="edit-product/:id" element={<EditProductPage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="banners" element={<BannerManagementPage />} /> {/* <-- Adicione a nova rota */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
