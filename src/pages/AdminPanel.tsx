
import React from 'react';
import AdminNavigation from '../components/AdminNavigation';
import Dashboard from '../components/Dashboard';

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      <main className="max-w-7xl mx-auto">
        <Dashboard />
      </main>
    </div>
  );
};

export default AdminPanel;
