import { useEffect, useState } from "react";
import { Edit, Save, X } from "lucide-react";

export default function LabResults() {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const API_URL = "http://localhost:5001/api/lab-results";

<<<<<<< HEAD
const [records,setRecords] = useState([
{
id:1,
patient:"patient@mail.com",
doctorId:"doctor@mail.com",
doctorName:"Dr. Smith",
date:"2026-03-01",
test:"Blood Test",
result:"High cholesterol",
nurseNote:"Patient advised to reduce fatty food"
}
]);

const [form,setForm] = useState({
patient:"",
doctorName:"",
test:"",
result:"",
nurseNote:""
});


// ================= DOCTOR =================
const handleDoctorSubmit = ()=>{

if(!form.doctorName){
  alert("Please enter doctor name");
  return;
}

const newRecord = {
id:Date.now(),
patient:form.patient,
doctorId: email,
doctorName: form.doctorName,
date:new Date().toISOString().split("T")[0],
test:form.test,
result:form.result,
nurseNote:""
};
=======
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    patient_code: "",
    doctor_id: role === "doctor" ? userId || "" : "",
    test_type: "",
    test_result: "",
    nurse_note: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    patient_code: "",
    doctor_id: "",
    test_type: "",
    test_result: "",
    nurse_note: "",
  });

  const [nurseNotes, setNurseNotes] = useState({});
>>>>>>> ของกู

  const fetchRecords = async () => {
    try {
      setLoading(true);

<<<<<<< HEAD
setForm({
patient:"",
doctorName:"",
test:"",
result:"",
nurseNote:""
});
=======
      const params = new URLSearchParams({
        role: role || "",
        userId: userId || "",
      });
>>>>>>> ของกู

      const res = await fetch(`${API_URL}?${params.toString()}`);
      const data = await res.json();

<<<<<<< HEAD

// ================= NURSE (FIX BUG (Old)) =================
const handleNurseUpdate = (id)=>{

const updated = records.map(r => {

  if(r.id === id){

    const newNote = form.nurseNote;

    // 🔥 แยก note เก่า
    const oldNotes = r.nurseNote
      ? r.nurseNote.split("\n").map(n =>
          n.replace(" (Old)", "")
        )
      : [];

    // 🔥 ใส่ (Old) ใหม่ให้ทุกตัว
    const formattedOldNotes = oldNotes.map(n => `${n} (Old)`);

    // 🔥 รวมใหม่ (ล่าสุดอยู่บน)
    const combinedNote = [
      newNote,
      ...formattedOldNotes
    ].join("\n");

    return {
      ...r,
      nurseNote: combinedNote
    };
  }

  return r;
});
=======
      if (!res.ok) {
        throw new Error(data.message || "Failed to load lab results");
      }

      setRecords(data);
    } catch (error) {
      console.error("fetchRecords error:", error);
      alert(error.message || "Failed to load lab results");
    } finally {
      setLoading(false);
    }
  };
>>>>>>> ของกู

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCreate = async () => {
    if (
      !form.patient_code ||
      !form.doctor_id ||
      !form.test_type ||
      !form.test_result
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        patient_code: form.patient_code.trim().toUpperCase(),
        doctor_id: Number(form.doctor_id),
        test_type: form.test_type.trim(),
        test_result: form.test_result.trim(),
        nurse_note: form.nurse_note.trim(),
      };

<<<<<<< HEAD

// ================= FILTER =================
const visibleRecords = records.filter(r=>{
=======
      console.log("create payload:", payload);
>>>>>>> ของกู

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

<<<<<<< HEAD
if(role === "doctor") return r.doctorId === email;
=======
      const data = await res.json();
>>>>>>> ของกู

      if (!res.ok) {
        throw new Error(data.message || "Failed to create lab result");
      }

      setRecords((prev) => [data, ...prev]);

<<<<<<< HEAD

return(
=======
      setForm({
        patient_code: "",
        doctor_id: role === "doctor" ? userId || "" : "",
        test_type: "",
        test_result: "",
        nurse_note: "",
      });
    } catch (error) {
      console.error("handleCreate error:", error);
      alert(error.message || "Failed to create lab result");
    }
  };
>>>>>>> ของกู

  const handleStartEdit = (record) => {
    setEditingId(record.id);
    setEditForm({
      patient_code: record.patient_code || "",
      doctor_id: record.doctor_id || "",
      test_type: record.test_type || "",
      test_result: record.test_result || "",
      nurse_note: record.nurse_note || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      patient_code: "",
      doctor_id: "",
      test_type: "",
      test_result: "",
      nurse_note: "",
    });
  };

<<<<<<< HEAD

{/* ================= DOCTOR FORM ================= */}
{role === "doctor" && (
=======
  const handleUpdate = async (id) => {
    if (
      !editForm.patient_code ||
      !editForm.doctor_id ||
      !editForm.test_type ||
      !editForm.test_result
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        patient_code: editForm.patient_code.trim().toUpperCase(),
        doctor_id: Number(editForm.doctor_id),
        test_type: editForm.test_type.trim(),
        test_result: editForm.test_result.trim(),
        nurse_note: editForm.nurse_note.trim(),
      };
>>>>>>> ของกู

      console.log("update payload:", payload);

      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

<<<<<<< HEAD
<input
placeholder="Doctor Name (e.g. Dr. Smith)"
value={form.doctorName}
onChange={(e)=>setForm({...form,doctorName:e.target.value})}
className="border p-2 rounded w-full"
/>

<input
placeholder="Test Type"
value={form.test}
onChange={(e)=>setForm({...form,test:e.target.value})}
className="border p-2 rounded w-full"
/>
=======
      if (!res.ok) {
        throw new Error(data.message || "Failed to update lab result");
      }
>>>>>>> ของกู

      setRecords((prev) => prev.map((r) => (r.id === id ? data : r)));
      handleCancelEdit();
    } catch (error) {
      console.error("handleUpdate error:", error);
      alert(error.message || "Failed to update lab result");
    }
  };

  const handleNurseUpdate = async (id) => {
    const note = nurseNotes[id];

    if (!note || !note.trim()) {
      alert("Please enter nurse note");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${id}/nurse-note`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nurse_note: note.trim(),
        }),
      });

<<<<<<< HEAD

{/* ================= RESULTS ================= */}
<div className="bg-white p-6 rounded-xl shadow">
=======
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update nurse note");
      }
>>>>>>> ของกู

      setRecords((prev) => prev.map((r) => (r.id === id ? data : r)));
      setNurseNotes((prev) => ({ ...prev, [id]: "" }));
    } catch (error) {
      console.error("handleNurseUpdate error:", error);
      alert(error.message || "Failed to update nurse note");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Lab Results</h1>

      {(role === "doctor" || role === "admin") && (
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="font-semibold text-lg">Add Lab Result</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Patient Code (เช่น P002)"
              value={form.patient_code}
              onChange={(e) =>
                setForm({ ...form, patient_code: e.target.value })
              }
              className="border p-2 rounded w-full"
            />

            <input
              placeholder="Doctor ID"
              value={form.doctor_id}
              onChange={(e) =>
                setForm({ ...form, doctor_id: e.target.value })
              }
              className="border p-2 rounded w-full"
            />

<<<<<<< HEAD
<p className="text-sm text-gray-600">
Doctor: {r.doctorName}
</p>

<p className="text-xs text-gray-400">
ID: {r.doctorId}
</p>
=======
            <input
              placeholder="Test Type"
              value={form.test_type}
              onChange={(e) =>
                setForm({ ...form, test_type: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
>>>>>>> ของกู

            <input
              placeholder="Nurse Note (optional)"
              value={form.nurse_note}
              onChange={(e) =>
                setForm({ ...form, nurse_note: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
          </div>

          <textarea
            placeholder="Test Result"
            value={form.test_result}
            onChange={(e) =>
              setForm({ ...form, test_result: e.target.value })
            }
            className="border p-2 rounded w-full"
            rows={4}
          />

          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Result
          </button>
        </div>
      )}

<<<<<<< HEAD
{/* ⭐ แสดงหลายบรรทัด */}
<p className="text-sm text-green-700 whitespace-pre-line">
Nurse Note: {r.nurseNote || "Waiting for nurse update"}
</p>


{/* ================= NURSE ================= */}
{role === "nurse" && (
=======
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Patient Lab Records</h2>

        {loading ? (
          <p>Loading...</p>
        ) : records.length === 0 ? (
          <p className="text-gray-500">No lab results found</p>
        ) : (
          <div className="space-y-4">
            {records.map((r) => (
              <div key={r.id} className="border p-4 rounded-lg space-y-3">
                {editingId === r.id ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        placeholder="Patient Code"
                        value={editForm.patient_code}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            patient_code: e.target.value,
                          })
                        }
                        className="border p-2 rounded w-full"
                      />

                      <input
                        placeholder="Doctor ID"
                        value={editForm.doctor_id}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            doctor_id: e.target.value,
                          })
                        }
                        className="border p-2 rounded w-full"
                      />
>>>>>>> ของกู

                      <input
                        placeholder="Test Type"
                        value={editForm.test_type}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            test_type: e.target.value,
                          })
                        }
                        className="border p-2 rounded w-full"
                      />

                      <input
                        placeholder="Nurse Note"
                        value={editForm.nurse_note}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            nurse_note: e.target.value,
                          })
                        }
                        className="border p-2 rounded w-full"
                      />
                    </div>

                    <textarea
                      placeholder="Test Result"
                      value={editForm.test_result}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          test_result: e.target.value,
                        })
                      }
                      className="border p-2 rounded w-full"
                      rows={4}
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(r.id)}
                        className="bg-green-600 text-white px-3 py-2 rounded flex items-center gap-1"
                      >
                        <Save size={16} /> Save
                      </button>

                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-400 text-white px-3 py-2 rounded flex items-center gap-1"
                      >
                        <X size={16} /> Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-semibold">Record ID: {r.id}</p>
                    <p className="text-sm">
                      Patient Code: {r.patient_code || "-"}
                    </p>
                    <p className="text-sm">Patient ID: {r.patient_id}</p>
                    <p className="text-sm">Doctor ID: {r.doctor_id}</p>
                    <p className="text-sm">Test Type: {r.test_type}</p>
                    <p className="text-sm">Test Result: {r.test_result}</p>
                    <p className="text-sm text-green-700">
                      Nurse Note: {r.nurse_note || "-"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created:{" "}
                      {r.created_at
                        ? new Date(r.created_at).toLocaleString()
                        : "-"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Updated:{" "}
                      {r.updated_at
                        ? new Date(r.updated_at).toLocaleString()
                        : "-"}
                    </p>

                    {(role === "doctor" || role === "admin") && (
                      <button
                        onClick={() => handleStartEdit(r)}
                        className="bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-1"
                      >
                        <Edit size={16} /> Edit
                      </button>
                    )}

                    {role === "nurse" && (
                      <div className="mt-3">
                        <textarea
                          placeholder="Update nurse note..."
                          value={nurseNotes[r.id] || ""}
                          onChange={(e) =>
                            setNurseNotes((prev) => ({
                              ...prev,
                              [r.id]: e.target.value,
                            }))
                          }
                          className="border p-2 rounded w-full"
                          rows={3}
                        />

                        <button
                          onClick={() => handleNurseUpdate(r.id)}
                          className="bg-green-600 text-white px-3 py-2 mt-2 rounded"
                        >
                          Update Nurse Note
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}