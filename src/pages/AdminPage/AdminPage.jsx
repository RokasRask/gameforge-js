import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';
import AdminDashboard from '../components/admin/AdminDashboard/AdminDashboard';
import GameManager from '../components/admin/GameManager/GameManager';
import GameEditor from '../components/admin/GameEditor/GameEditor';

/**
 * AdminPage - Entry point for the admin section
 * 
 * Handles routing for all admin pages
 */
const AdminPage = () => {
  // Normally we would check for admin role here
  // const { user } = useContext(AuthContext);
  // if (!user || !user.isAdmin) {
  //   return <Navigate to="/login" />;
  // }
  
  return (
    <AdminLayout>
      <Routes>
        {/* Dashboard */}
        <Route index element={<AdminDashboard />} />
        
        {/* Games Management */}
        <Route path="games">
          <Route index element={<GameManager />} />
          <Route path="add" element={<GameEditor />} />
          <Route path="edit/:id" element={<GameEditor />} />
        </Route>
        
        {/* Other admin routes would go here */}
        {/* e.g. categories, users, reviews, settings */}
        <Route path="categories" element={<div>Categories management (not implemented)</div>} />
        <Route path="users" element={<div>Users management (not implemented)</div>} />
        <Route path="reviews" element={<div>Reviews management (not implemented)</div>} />
        <Route path="settings" element={<div>Settings page (not implemented)</div>} />
        
        {/* Catch-all route for admin section */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminPage;