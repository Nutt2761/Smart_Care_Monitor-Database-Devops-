import { useEffect, useState } from "react";

export default function Medications() {
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    patient: "",
    medicine: "",
    type: "",
    usage: "",
  });
  const [noteInputs, setNoteInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:5001/api/medications";

  const updateFormField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setMessage("");
  };

  const fetchMedications = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(
        `${API_URL}?role=${encodeURIComponent(role || "")}&email=${encodeURIComponent(email || "")}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch medications");
      }

      setRecords(data);
    } catch (error) {
      console.error("FETCH MEDICATIONS ERROR:", error);
      setMessage(error.message || "Failed to fetch medications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("ROLE:", role);
    console.log("EMAIL:", email);
    fetchMedications();
  }, []);

  const handleDoctorSubmit = async () => {
    try {
      setMessage("");

      const patientId = form.patient.trim();
      const medicine = form.medicine.trim();
      const type = form.type.trim();
      const usage = form.usage.trim();

      if (!patientId || !medicine || !type || !usage) {
        setMessage("Please fill all required fields");
        return;
      }

      if (!email || !email.trim()) {
        setMessage("Doctor email not found. Please login again");
        return;
      }

      const payload = {
        patientId: Number(patientId),
        doctorEmail: email.trim(),
        medicine,
        type,
        usage,
      };

      console.log("SEND PAYLOAD:", payload);

      setSubmitting(true);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("RESPONSE STATUS:", res.status);
      console.log("RESPONSE DATA:", data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to add medication");
      }

      setRecords((prev) => [data, ...prev]);
      setForm({
        patient: "",
        medicine: "",
        type: "",
        usage: "",
      });
      setMessage("Medication added successfully");
    } catch (error) {
      console.error("ADD MEDICATION ERROR:", error);
      setMessage(error.message || "Failed to add medication");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNurseUpdate = async (id) => {
    try {
      setMessage("");
      const nurseNote = (noteInputs[id] || "").trim();

      if (!nurseNote) {
        setMessage("Please enter nurse note");
        return;
      }

      const res = await fetch(`${API_URL}/${id}/nurse-note`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nurseNote }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update nurse note");
      }

      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, nurseNote } : r))
      );

      setNoteInputs((prev) => ({
        ...prev,
        [id]: "",
      }));

      setMessage("Nurse note updated successfully");
    } catch (error) {
      console.error("UPDATE NURSE NOTE ERROR:", error);
      setMessage(error.message || "Failed to update nurse note");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Medication Records</h1>

      {message && (
        <div className="bg-blue-100 text-blue-800 p-3 rounded-lg">
          {message}
        </div>
      )}

      {role === "doctor" && (
        <div className="bg-white p-6 rounded-xl shadow space-y-3">
          <h2 className="font-semibold">Prescribe Medicine</h2>

          <input
            type="number"
            min="1"
            placeholder="Patient ID"
            value={form.patient}
            onChange={(e) => updateFormField("patient", e.target.value)}
            className="border p-2 rounded w-full"
          />

          <input
            type="text"
            placeholder="Medicine Name"
            value={form.medicine}
            onChange={(e) => updateFormField("medicine", e.target.value)}
            className="border p-2 rounded w-full"
          />

          <input
            type="text"
            placeholder="Medicine Type (Capsule / Cream / Tablet)"
            value={form.type}
            onChange={(e) => updateFormField("type", e.target.value)}
            className="border p-2 rounded w-full"
          />

          <textarea
            placeholder="Usage (How to use)"
            value={form.usage}
            onChange={(e) => updateFormField("usage", e.target.value)}
            className="border p-2 rounded w-full"
            rows={4}
          />

          <button
            onClick={handleDoctorSubmit}
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Medication"}
          </button>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Medication Records</h2>

        {loading ? (
          <p>Loading medication records...</p>
        ) : (
          <div className="space-y-4">
            {records.length === 0 ? (
              <p className="text-gray-500">No medication records found</p>
            ) : (
              records.map((r) => (
                <div key={r.id} className="border p-4 rounded-lg">
                  <p className="font-semibold">Patient: {r.patient}</p>
                  <p className="text-sm text-gray-600">Doctor: {r.doctor}</p>
                  <p className="text-sm">Date: {r.date}</p>
                  <p className="text-sm">Medicine: {r.medicine}</p>
                  <p className="text-sm">Type: {r.type}</p>
                  <p className="text-sm">Usage: {r.usage}</p>
                  <p className="text-sm text-green-700">
                    Nurse Note: {r.nurseNote || "Waiting for nurse explanation"}
                  </p>

                  {role === "nurse" && (
                    <div className="mt-3">
                      <textarea
                        placeholder="Explain how patient should use the medicine..."
                        value={noteInputs[r.id] || ""}
                        onChange={(e) => {
                          setNoteInputs((prev) => ({
                            ...prev,
                            [r.id]: e.target.value,
                          }));
                          setMessage("");
                        }}
                        className="border p-2 rounded w-full"
                        rows={3}
                      />
                      <button
                        onClick={() => handleNurseUpdate(r.id)}
                        className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
                      >
                        Update Note
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}