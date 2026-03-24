import { useEffect, useState } from "react";
import { CalendarPlus, Pencil, XCircle } from "lucide-react";

export default function Appointments() {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const API_URL = "http://localhost:5001/api/appointments";

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    date: "",
    time: "",
    reason: "",
  });

  const [editingId, setEditingId] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        role: role || "",
        userId: userId || "",
      });

      const res = await fetch(`${API_URL}?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load appointments");
      }

      setAppointments(data);
    } catch (error) {
      console.error("fetchAppointments error:", error);
      alert(error.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const resetForm = () => {
    setForm({
      patient_id: "",
      doctor_id: "",
      date: "",
      time: "",
      reason: "",
    });
  };

  const handleCreate = async () => {
    if (
      !form.patient_id ||
      !form.doctor_id ||
      !form.date ||
      !form.time ||
      !form.reason
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        patient_id: Number(form.patient_id),
        doctor_id: Number(form.doctor_id),
        date: form.date,
        time: form.time,
        reason: form.reason.trim(),
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create appointment");
      }

      setAppointments((prev) => [data, ...prev]);
      resetForm();
    } catch (error) {
      console.error("handleCreate error:", error);
      alert(error.message || "Failed to create appointment");
    }
  };

  const handleEdit = (a) => {
    setEditingId(a.id);
    setForm({
      patient_id: a.patient_id?.toString() || "",
      doctor_id: a.doctor_id?.toString() || "",
      date: a.date ? String(a.date).slice(0, 10) : "",
      time: a.time ? String(a.time).slice(0, 5) : "",
      reason: a.reason || "",
    });
  };

  const handleSave = async () => {
    if (
      !form.patient_id ||
      !form.doctor_id ||
      !form.date ||
      !form.time ||
      !form.reason
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        patient_id: Number(form.patient_id),
        doctor_id: Number(form.doctor_id),
        date: form.date,
        time: form.time,
        reason: form.reason.trim(),
      };

      const res = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update appointment");
      }

      setAppointments((prev) =>
        prev.map((a) => (a.id === editingId ? data : a))
      );

      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error("handleSave error:", error);
      alert(error.message || "Failed to update appointment");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete appointment");
      }

      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("handleDelete error:", error);
      alert(error.message || "Failed to delete appointment");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Appointments Schedule</h1>

      {role === "nurse" && editingId === null && (
        <div className="bg-white p-6 rounded-xl shadow space-y-3">
          <h2 className="flex items-center gap-2 font-semibold">
            <CalendarPlus size={18} />
            Create Appointment
          </h2>

          <input
            placeholder="Patient ID"
            value={form.patient_id}
            onChange={(e) =>
              setForm({ ...form, patient_id: e.target.value })
            }
            className="border px-3 py-2 rounded w-full"
          />

          <input
            placeholder="Doctor ID"
            value={form.doctor_id}
            onChange={(e) =>
              setForm({ ...form, doctor_id: e.target.value })
            }
            className="border px-3 py-2 rounded w-full"
          />

          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />

          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />

          <input
            placeholder="Reason"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />

          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Create Appointment
          </button>
        </div>
      )}

      {editingId && (
        <div className="bg-yellow-50 border border-yellow-300 p-6 rounded-xl space-y-3">
          <h2 className="font-semibold">Edit Appointment</h2>

          <input
            placeholder="Patient ID"
            value={form.patient_id}
            onChange={(e) =>
              setForm({ ...form, patient_id: e.target.value })
            }
            className="border px-3 py-2 rounded w-full"
          />

          <input
            placeholder="Doctor ID"
            value={form.doctor_id}
            onChange={(e) =>
              setForm({ ...form, doctor_id: e.target.value })
            }
            className="border px-3 py-2 rounded w-full"
          />

          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />

          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />

          <input
            placeholder="Reason"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>

            <button
              onClick={handleCancelEdit}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>

        {loading ? (
          <p>Loading...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500">No appointments found</p>
        ) : (
          <div className="space-y-3">
            {appointments.map((a) => (
              <div
                key={a.id}
                className="border p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    Patient ID: {a.patient_id}
                  </p>

                  <p className="text-sm text-gray-500">
                    Doctor ID: {a.doctor_id}
                  </p>

                  <p className="text-sm text-gray-500">
                    Reason: {a.reason}
                  </p>

                  {a.created_at && (
                    <p className="text-xs text-gray-400 mt-1">
                      Created: {new Date(a.created_at).toLocaleString()}
                    </p>
                  )}

                  {a.updated_at && (
                    <p className="text-xs text-gray-400">
                      Updated: {new Date(a.updated_at).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p>{a.date ? String(a.date).slice(0, 10) : "-"}</p>

                  <p className="text-sm text-gray-500">
                    {a.time ? String(a.time).slice(0, 5) : "-"}
                  </p>

                  {(role === "admin" || role === "nurse") && (
                    <div className="flex gap-2 mt-2 justify-end">
                      <button
                        onClick={() => handleEdit(a)}
                        className="bg-yellow-500 text-white p-2 rounded"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(a.id)}
                        className="bg-red-500 text-white p-2 rounded"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}