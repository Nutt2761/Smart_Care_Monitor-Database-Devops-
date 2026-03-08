import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientDetail from "./pages/PatientDetail";
import VitalSigns from "./pages/VitalSigns";
import MedicalNotes from "./pages/MedicalNotes";
import UserManagement from "./pages/UserManagement";
import AddPatient from "./pages/AddPatient";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/add" element={<AddPatient />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/notes" element={<MedicalNotes />} />
          <Route path="/users" element={<UserManagement />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;