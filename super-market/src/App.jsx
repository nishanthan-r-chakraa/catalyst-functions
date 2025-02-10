import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Items from "./pages/ItemManagement";
import Layout from "./Layout";

function App() {
  return (
    <Router basename="/app">
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Layout />} />
          <Route path="/login" element={<Dashboard />} />
          <Route path="/item-management" element={<Items />} />
          <Route path="" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
