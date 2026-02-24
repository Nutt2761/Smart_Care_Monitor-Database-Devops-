import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import VitalSigns from "./pages/VitalSigns";
import MedicalNotes from "./pages/MedicalNotes";
import UserManagement from "./pages/UserManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        {/* Layout ครอบทุกหน้า */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/vitals" element={<VitalSigns />} />
          <Route path="/notes" element={<MedicalNotes />} />
          <Route path="/users" element={<UserManagement />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;