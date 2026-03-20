import { useState, useEffect } from "react";

export default function Medications(){

const role = localStorage.getItem("role");
const doctorId = localStorage.getItem("email"); // ใช้เป็น ID

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

// ✅ save ทุกครั้งที่มีการเปลี่ยน
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

setRecords([newRecord,...records]);

setForm({
patient:"",
doctorName:"",
medicine:"",
type:"",
usage:"",
nurseNote:""
});

};


// ================= NURSE =================
const handleNurseUpdate = (id)=>{

const updated = records.map(r=>
r.id === id
? {...r,nurseNote:form.nurseNote}
: r
);

setRecords(updated);

setForm({...form,nurseNote:""});

};


// ================= FILTER =================
const visibleRecords = records.filter(r=>{

if(role === "patient") return r.patient === doctorId;

if(role === "doctor") return r.doctorId === doctorId;

return true;

});


return(

<div className="space-y-6">

<h1 className="text-3xl font-bold">
Medication Records
</h1>


{/* ================= DOCTOR FORM ================= */}
{role === "doctor" && (

<div className="bg-white p-6 rounded-xl shadow space-y-3">

<h2 className="font-semibold">
Prescribe Medicine
</h2>

<input
placeholder="Patient Email"
value={form.patient}
onChange={(e)=>setForm({...form,patient:e.target.value})}
className="border p-2 rounded w-full"
/>

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
placeholder="Medicine Type (Capsule / Cream / Tablet)"
value={form.type}
onChange={(e)=>setForm({...form,type:e.target.value})}
className="border p-2 rounded w-full"
/>

<textarea
placeholder="Usage (How to use)"
value={form.usage}
onChange={(e)=>setForm({...form,usage:e.target.value})}
className="border p-2 rounded w-full"
/>

<button
onClick={handleDoctorSubmit}
className="bg-blue-600 text-white px-4 py-2 rounded"
>
Add Medication
</button>

</div>

)}


{/* ================= RECORD LIST ================= */}
<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-xl font-semibold mb-4">
Medication Records
</h2>

<div className="space-y-4">

{visibleRecords.map((r)=>(

<div
key={r.id}
className="border p-4 rounded-lg"
>

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

<p className="text-sm text-green-700">
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

}