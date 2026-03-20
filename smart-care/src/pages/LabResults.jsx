import { useState } from "react";

export default function LabResults(){

const role = localStorage.getItem("role");
const email = localStorage.getItem("email");

// ⭐ แก้โครงสร้างข้อมูล
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

// ⭐ เพิ่ม doctorName
const [form,setForm] = useState({
patient:"",
doctorName:"",
test:"",
result:"",
nurseNote:""
});

const handleDoctorSubmit = ()=>{

// 🔒 กันลืมกรอกชื่อหมอ
if(!form.doctorName){
  alert("Please enter doctor name");
  return;
}

const newRecord = {
id:Date.now(),
patient:form.patient,
doctorId: email,              // ⭐ ใช้ email เป็น ID
doctorName: form.doctorName,  // ⭐ ชื่อหมอ
date:new Date().toISOString().split("T")[0],
test:form.test,
result:form.result,
nurseNote:""
};

setRecords([newRecord,...records]);

setForm({
patient:"",
doctorName:"",
test:"",
result:"",
nurseNote:""
});

};

const handleNurseUpdate = (id)=>{

const updated = records.map(r=>
r.id === id
? {...r,nurseNote:form.nurseNote}
: r
);

setRecords(updated);

setForm({...form,nurseNote:""});

};

const visibleRecords = records.filter(r=>{

if(role === "patient") return r.patient === email;

if(role === "doctor") return r.doctorId === email; // ⭐ เปลี่ยนตรงนี้

return true;

});

return(

<div className="space-y-6">

<h1 className="text-3xl font-bold">
Lab Results
</h1>

{/* Doctor form */}

{role === "doctor" && (

<div className="bg-white p-6 rounded-xl shadow space-y-3">

<h2 className="font-semibold">
Add Lab Result
</h2>

<input
placeholder="Patient Email"
value={form.patient}
onChange={(e)=>setForm({...form,patient:e.target.value})}
className="border p-2 rounded w-full"
/>

{/* ⭐ เพิ่มช่องชื่อหมอ */}
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

<textarea
placeholder="Test Result"
value={form.result}
onChange={(e)=>setForm({...form,result:e.target.value})}
className="border p-2 rounded w-full"
/>

<button
onClick={handleDoctorSubmit}
className="bg-blue-600 text-white px-4 py-2 rounded"
>
Submit Result
</button>

</div>

)}

{/* Results list */}

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-xl font-semibold mb-4">
Patient Lab Records
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

{/* ⭐ แสดงชื่อหมอ */}
<p className="text-sm text-gray-600">
Doctor: {r.doctorName}
</p>

{/* ⭐ แสดง doctor ID */}
<p className="text-xs text-gray-400">
ID: {r.doctorId}
</p>

<p className="text-sm">
Date: {r.date}
</p>

<p className="text-sm">
Test: {r.test}
</p>

<p className="text-sm">
Result: {r.result}
</p>

<p className="text-sm text-green-700">
Nurse Note: {r.nurseNote || "Waiting for nurse update"}
</p>

{/* Nurse update */}

{role === "nurse" && (

<div className="mt-3">

<textarea
placeholder="Write patient explanation..."
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