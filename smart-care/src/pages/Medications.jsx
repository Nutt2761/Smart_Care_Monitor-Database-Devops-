<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useEffect, useState } from "react";
>>>>>>> ของกู

export default function Medications() {
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

<<<<<<< HEAD
const role = localStorage.getItem("role");
const doctorId = localStorage.getItem("email");

// ✅ โหลดจาก localStorage
const [records,setRecords] = useState(()=>{
const saved = localStorage.getItem("medications");
return saved ? JSON.parse(saved) : [
{
id:1,
patient:"patient@mail.com",
doctorId:"doctor@mail.com",
doctorName:"Dr. Smith",
date:"2026-03-01",
medicine:"Amoxicillin",
type:"Capsule",
usage:"Take 1 capsule after meal",
nurseNote:"Take after breakfast and dinner"
}
];
});

// ✅ save
useEffect(()=>{
localStorage.setItem("medications",JSON.stringify(records));
},[records]);

const [form,setForm] = useState({
patient:"",
doctorName:"",
medicine:"",
type:"",
usage:"",
nurseNote:""
});


// ================= DOCTOR =================
const handleDoctorSubmit = ()=>{

if(!form.patient || !form.medicine || !form.type || !form.usage || !form.doctorName){
alert("กรอกข้อมูลให้ครบ!");
return;
}

const newRecord = {
id:Date.now(),
patient:form.patient,
doctorId:doctorId,
doctorName:form.doctorName,
date:new Date().toISOString().split("T")[0],
medicine:form.medicine,
type:form.type,
usage:form.usage,
nurseNote:""
};
=======
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
>>>>>>> ของกู

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch medications");
      }

<<<<<<< HEAD
setForm({
patient:"",
doctorName:"",
medicine:"",
type:"",
usage:"",
nurseNote:""
});
=======
      setRecords(data);
    } catch (error) {
      console.error("FETCH MEDICATIONS ERROR:", error);
      setMessage(error.message || "Failed to fetch medications");
    } finally {
      setLoading(false);
    }
  };
>>>>>>> ของกู

  useEffect(() => {
    console.log("ROLE:", role);
    console.log("EMAIL:", email);
    fetchMedications();
  }, []);

<<<<<<< HEAD

// ================= NURSE (🔥 FIX (Old)) =================
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

    // 🔥 ใส่ (Old) ใหม่
    const formattedOldNotes = oldNotes.map(n => `${n} (Old)`);

    // 🔥 รวมใหม่
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
  const handleDoctorSubmit = async () => {
    try {
      setMessage("");

      const patientId = form.patient.trim();
      const medicine = form.medicine.trim();
      const type = form.type.trim();
      const usage = form.usage.trim();
>>>>>>> ของกู

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

<<<<<<< HEAD

// ================= FILTER =================
const visibleRecords = records.filter(r=>{

if(role === "patient") return r.patient === doctorId;

if(role === "doctor") return r.doctorId === doctorId;
=======
      console.log("SEND PAYLOAD:", payload);

      setSubmitting(true);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
>>>>>>> ของกู

      const data = await res.json();

      console.log("RESPONSE STATUS:", res.status);
      console.log("RESPONSE DATA:", data);

<<<<<<< HEAD

return(
=======
      if (!res.ok) {
        throw new Error(data.message || "Failed to add medication");
      }
>>>>>>> ของกู

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

<<<<<<< HEAD

{/* ================= DOCTOR ================= */}
{role === "doctor" && (
=======
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
>>>>>>> ของกู

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update nurse note");
      }

      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, nurseNote } : r))
      );

<<<<<<< HEAD
<input
placeholder="Doctor Name"
value={form.doctorName}
onChange={(e)=>setForm({...form,doctorName:e.target.value})}
className="border p-2 rounded w-full"
/>

<input
placeholder="Medicine Name"
value={form.medicine}
onChange={(e)=>setForm({...form,medicine:e.target.value})}
className="border p-2 rounded w-full"
/>

<input
placeholder="Medicine Type"
value={form.type}
onChange={(e)=>setForm({...form,type:e.target.value})}
className="border p-2 rounded w-full"
/>
=======
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
>>>>>>> ของกู

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

<<<<<<< HEAD

{/* ================= LIST ================= */}
<div className="bg-white p-6 rounded-xl shadow">
=======
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
>>>>>>> ของกู

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

<<<<<<< HEAD
<div key={r.id} className="border p-4 rounded-lg">

<p className="font-semibold">
Patient: {r.patient}
</p>

<p className="text-sm text-gray-600">
Doctor ID: {r.doctorId}
</p>

<p className="text-sm font-medium">
Doctor Name: {r.doctorName}
</p>

<p className="text-sm">
Date: {r.date}
</p>

<p className="text-sm">
Medicine: {r.medicine}
</p>

<p className="text-sm">
Type: {r.type}
</p>

<p className="text-sm">
Usage: {r.usage}
</p>

{/* ⭐ แสดงหลายบรรทัด */}
<p className="text-sm text-green-700 whitespace-pre-line">
Nurse Note: {r.nurseNote || "Waiting for nurse explanation"}
</p>


{/* ================= NURSE ================= */}
{role === "nurse" && (

<div className="mt-3">

<textarea
placeholder="Explain how patient should use the medicine..."
value={form.nurseNote}
onChange={(e)=>setForm({...form,nurseNote:e.target.value})}
className="border p-2 rounded w-full"
/>

<button
onClick={()=>handleNurseUpdate(r.id)}
className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
>
Update Note
</button>

</div>

)}

</div>

))}

</div>

</div>

</div>

);
=======
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
>>>>>>> ของกู

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