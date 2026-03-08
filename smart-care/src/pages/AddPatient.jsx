import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

export default function AddPatient() {

  const navigate = useNavigate();

  const [patient, setPatient] = useState({
    id: "",
    fullName: "",
    birthDate: "",
    age: "",
    weight: "",
    height: "",
    bloodType: "",
    chronicDisease: "",
    allergyHistory: "",
    currentMedication: "",
    emergencyContact: "",
    status: "stable",
  });

  const handleChange = (e) => {
    setPatient({
      ...patient,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const existingPatients =
    JSON.parse(localStorage.getItem("patients")) || [];

  const updatedPatients = [...existingPatients, patient];

  localStorage.setItem("patients", JSON.stringify(updatedPatients));

  alert("Patient added successfully");

  navigate("/patients");
};

  return (
    <div className="space-y-6">

      {/* Back Button */}
      <button
        onClick={() => navigate("/patients")}
        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back
      </button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Add Patient</h1>
        <p className="text-gray-600">
          Enter patient medical information
        </p>
      </div>

      {/* Form */}
      <div className="bg-white shadow-md rounded-xl p-6">

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          {/* Patient ID */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Patient ID
            </label>
            <input
              name="id"
              value={patient.id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              name="fullName"
              value={patient.fullName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Birth Date
            </label>
            <input
              type="date"
              name="birthDate"
              value={patient.birthDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Age
            </label>
            <input
              name="age"
              value={patient.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Weight (kg)
            </label>
            <input
              name="weight"
              value={patient.weight}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Height (cm)
            </label>
            <input
              name="height"
              value={patient.height}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Blood Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Blood Type
            </label>
            <select
              name="bloodType"
              value={patient.bloodType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select</option>
              <option>O+</option>
              <option>O-</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </div>

          {/* Chronic Disease */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Chronic Disease
            </label>
            <input
              name="chronicDisease"
              value={patient.chronicDisease}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Allergy History */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Allergy History
            </label>
            <input
              name="allergyHistory"
              value={patient.allergyHistory}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Current Medication */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Current Medication
            </label>
            <input
              name="currentMedication"
              value={patient.currentMedication}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Emergency Contact
            </label>
            <input
              name="emergencyContact"
              value={patient.emergencyContact}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              name="status"
              value={patient.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="stable">Stable</option>
              <option value="active">Active</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              <Save size={18} className="mr-2" />
              Save Patient
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}