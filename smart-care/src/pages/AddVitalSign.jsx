import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { addVitalSign } from "../services/VitalService";

export default function AddVitalSign() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    heart_rate: "",
    systolic: "",
    diastolic: "",
    respiration: "",
    temperature: "",
    spo2: "",
    recorded_at: new Date().toISOString().slice(0, 16),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await addVitalSign({
        patient_id: Number(id),
        heart_rate: form.heart_rate ? Number(form.heart_rate) : null,
        systolic: form.systolic ? Number(form.systolic) : null,
        diastolic: form.diastolic ? Number(form.diastolic) : null,
        respiration: form.respiration ? Number(form.respiration) : null,
        temperature: form.temperature ? Number(form.temperature) : null,
        spo2: form.spo2 ? Number(form.spo2) : null,
        recorded_at: form.recorded_at,
      });

      alert("Vital sign added successfully");
      navigate(`/patients/${id}`);
    } catch (err) {
      console.error("ADD VITAL ERROR:", err);
      setError(err.message || "Failed to add vital sign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back
      </button>

      <div>
        <h1 className="text-3xl font-bold">Add Vital Sign</h1>
        <p className="text-gray-600">Record patient vital signs</p>
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
            <label className="block text-sm font-medium mb-1">Heart Rate</label>
            <input
              type="number"
              name="heart_rate"
              value={form.heart_rate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Temperature</label>
            <input
              type="number"
              step="0.1"
              name="temperature"
              value={form.temperature}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Systolic</label>
            <input
              type="number"
              name="systolic"
              value={form.systolic}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Diastolic</label>
            <input
              type="number"
              name="diastolic"
              value={form.diastolic}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Respiration</label>
            <input
              type="number"
              name="respiration"
              value={form.respiration}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">SpO2</label>
            <input
              type="number"
              name="spo2"
              value={form.spo2}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Recorded At</label>
            <input
              type="datetime-local"
              name="recorded_at"
              value={form.recorded_at}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
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
              {loading ? "Saving..." : "Save Vital Sign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}