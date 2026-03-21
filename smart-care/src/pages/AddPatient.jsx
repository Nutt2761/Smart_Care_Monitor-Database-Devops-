import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

export default function AddPatient() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const [patient, setPatient] = useState({
    patient_code: "",
    full_name: "",
    birth_date: "",
    weight: "",
    height: "",
    blood_type: "",
    chronic_disease: "",
    allergy: "",
    emergency_contact: "",
    status: "stable",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5001/api/patients";

  const handleChange = (e) => {
    setPatient({
      ...patient,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError("User not found. Please login again.");
      return;
    }

    if (!patient.patient_code || !patient.full_name || !patient.birth_date) {
      setError("Please fill in required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: Number(userId),
          patient_code: patient.patient_code.trim(),
          full_name: patient.full_name.trim(),
          birth_date: patient.birth_date,
          weight: patient.weight,
          height: patient.height,
          blood_type: patient.blood_type,
          chronic_disease: patient.chronic_disease.trim(),
          allergy: patient.allergy.trim(),
          emergency_contact: patient.emergency_contact.trim(),
          status: patient.status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to add patient");
        return;
      }

      alert("Patient added successfully");
      navigate("/patients");
    } catch (err) {
      console.error("ADD PATIENT ERROR:", err);
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/patients")}
        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back
      </button>

      <div>
        <h1 className="text-3xl font-bold">Add Patient</h1>
        <p className="text-gray-600">Enter patient medical information</p>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {error && (
            <div className="md:col-span-2 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Patient Code
            </label>
            <input
              name="patient_code"
              value={patient.patient_code}
              onChange={handleChange}
              required
              placeholder="P001"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              name="full_name"
              value={patient.full_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Birth Date
            </label>
            <input
              type="date"
              name="birth_date"
              value={patient.birth_date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={patient.weight}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              name="height"
              value={patient.height}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Blood Type
            </label>
            <select
              name="blood_type"
              value={patient.blood_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Chronic Disease
            </label>
            <input
              name="chronic_disease"
              value={patient.chronic_disease}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Allergy
            </label>
            <input
              name="allergy"
              value={patient.allergy}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Emergency Contact
            </label>
            <input
              name="emergency_contact"
              value={patient.emergency_contact}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

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
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center w-full text-white py-3 rounded-lg ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <Save size={18} className="mr-2" />
              {loading ? "Saving..." : "Save Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}