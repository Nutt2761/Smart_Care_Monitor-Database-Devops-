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
import Appointments from "./pages/Appointments";
import LabResults from "./pages/LabResults";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* redirect root */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* login */}
        <Route path="/login" element={<Login />} />

        {/* protected layout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >

          {/* dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allow={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* patients */}
          <Route
            path="/patients"
            element={
              <ProtectedRoute allow={["admin","doctor","nurse"]}>
                <Patients />
              </ProtectedRoute>
            }
          />

          {/* add patient */}
          <Route
            path="/patients/add"
            element={
              <ProtectedRoute allow={["admin","doctor"]}>
                <AddPatient />
              </ProtectedRoute>
            }
          />

          {/* patient detail */}
          <Route
            path="/patients/:id"
            element={
              <ProtectedRoute allow={["admin","doctor","nurse"]}>
                <PatientDetail />
              </ProtectedRoute>
            }
          />

          {/* medical notes */}
          <Route
            path="/notes"
            element={
              <ProtectedRoute allow={["admin","doctor","nurse"]}>
                <MedicalNotes />
              </ProtectedRoute>
            }
          />

          {/* vital signs */}
          <Route
            path="/vitals"
            element={
              <ProtectedRoute allow={["admin","doctor","nurse"]}>
                <VitalSigns />
              </ProtectedRoute>
            }
          />

          {/* appointments */}
          <Route
            path="/appointments"
            element={
              <ProtectedRoute allow={["admin","doctor","nurse","patient"]}>
                <Appointments />
              </ProtectedRoute>
            }
          />

          {/* lab results ⭐ */}
          <Route
            path="/lab-results"
            element={
              <ProtectedRoute allow={["admin","doctor","nurse","patient"]}>
                <LabResults />
              </ProtectedRoute>
            }
          />

          {/* admin user management */}
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