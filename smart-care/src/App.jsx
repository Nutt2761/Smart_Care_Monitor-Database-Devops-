import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientDetail from "./pages/PatientDetail";
import VitalSigns from "./pages/VitalSigns";
import MedicalNotes from "./pages/MedicalNotes";
import UserManagement from "./pages/UserManagement_Admin";
import AddPatient from "./pages/AddPatient";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* แก้ปัญหา route "/" */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allow={["admin","doctor","nurse"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients"
            element={
              <ProtectedRoute allow={["admin","doctor","nurse"]}>
                <Patients />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients/add"
            element={
              <ProtectedRoute allow={["admin","doctor"]}>
                <AddPatient />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients/:id"
            element={
              <ProtectedRoute allow={["admin","doctor","nurse"]}>
                <PatientDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notes"
            element={
              <ProtectedRoute allow={["admin","doctor","nurse"]}>
                <MedicalNotes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vitals"
            element={
              <ProtectedRoute allow={["admin","doctor","nurse"]}>
                <VitalSigns />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute allow={["admin"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;