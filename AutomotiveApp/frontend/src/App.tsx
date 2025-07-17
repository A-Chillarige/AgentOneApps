import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import VehicleDetail from './pages/VehicleDetail';
import ReminderAgent from './pages/ReminderAgent';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="vehicles/:id" element={<VehicleDetail />} />
        <Route path="reminders" element={<ReminderAgent />} />
        <Route path="settings" element={<Settings />} />
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
