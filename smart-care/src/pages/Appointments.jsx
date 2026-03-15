import { useState } from "react";
import { CalendarPlus, Pencil, XCircle } from "lucide-react";

export default function Appointments(){

const role = localStorage.getItem("role");
const email = localStorage.getItem("email");

const [appointments,setAppointments] = useState([
{
id:1,
patient:"patient@mail.com",
doctor:"doctor@mail.com",
date:"2026-03-20",
time:"09:00",
reason:"General Checkup"
},
{
id:2,
patient:"patient@mail.com",
doctor:"doctor@mail.com",
date:"2026-03-22",
time:"11:30",
reason:"Follow up"
}
]);

const [form,setForm] = useState({
patient:"",
doctor:"",
date:"",
time:"",
reason:""
});

const [editingId,setEditingId] = useState(null);

/* CREATE APPOINTMENT */

const handleCreate = ()=>{

if(!form.patient || !form.doctor) return;

const newAppointment = {
id:Date.now(),
...form
};

setAppointments([newAppointment,...appointments]);

setForm({
patient:"",
doctor:"",
date:"",
time:"",
reason:""
});

};

/* START EDIT */

const handleEdit = (a)=>{

setEditingId(a.id);

setForm({
patient:a.patient,
doctor:a.doctor,
date:a.date,
time:a.time,
reason:a.reason
});

};

/* SAVE EDIT */

const handleSave = ()=>{

const updated = appointments.map(a=>
a.id === editingId
? { ...a,...form }
: a
);

setAppointments(updated);
setEditingId(null);

setForm({
patient:"",
doctor:"",
date:"",
time:"",
reason:""
});

};

/* CANCEL APPOINTMENT */

const handleCancel = (id)=>{

const filtered = appointments.filter(a=>a.id !== id);

setAppointments(filtered);

};

/* ROLE FILTER */

const visibleAppointments = appointments.filter(a=>{

if(role === "doctor") return a.doctor === email;

if(role === "patient") return a.patient === email;

return true;

});

return(

<div className="space-y-6">

<h1 className="text-3xl font-bold">
Appointments Schedule
</h1>

{/* CREATE FORM (NURSE ONLY) */}

{role === "nurse" && editingId === null && (

<div className="bg-white p-6 rounded-xl shadow space-y-3">

<h2 className="flex items-center gap-2 font-semibold">
<CalendarPlus size={18}/>
Create Appointment
</h2>

<input
placeholder="Patient Email"
value={form.patient}
onChange={(e)=>setForm({...form,patient:e.target.value})}
className="border px-3 py-2 rounded w-full"
/>

<input
placeholder="Doctor Email"
value={form.doctor}
onChange={(e)=>setForm({...form,doctor:e.target.value})}
className="border px-3 py-2 rounded w-full"
/>

<input
type="date"
value={form.date}
onChange={(e)=>setForm({...form,date:e.target.value})}
className="border px-3 py-2 rounded w-full"
/>

<input
type="time"
value={form.time}
onChange={(e)=>setForm({...form,time:e.target.value})}
className="border px-3 py-2 rounded w-full"
/>

<input
placeholder="Reason"
value={form.reason}
onChange={(e)=>setForm({...form,reason:e.target.value})}
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

{/* EDIT FORM */}

{editingId && (

<div className="bg-yellow-50 border border-yellow-300 p-6 rounded-xl space-y-3">

<h2 className="font-semibold">
Edit Appointment
</h2>

<input
value={form.patient}
onChange={(e)=>setForm({...form,patient:e.target.value})}
className="border px-3 py-2 rounded w-full"
/>

<input
value={form.doctor}
onChange={(e)=>setForm({...form,doctor:e.target.value})}
className="border px-3 py-2 rounded w-full"
/>

<input
type="date"
value={form.date}
onChange={(e)=>setForm({...form,date:e.target.value})}
className="border px-3 py-2 rounded w-full"
/>

<input
type="time"
value={form.time}
onChange={(e)=>setForm({...form,time:e.target.value})}
className="border px-3 py-2 rounded w-full"
/>

<input
value={form.reason}
onChange={(e)=>setForm({...form,reason:e.target.value})}
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
onClick={()=>setEditingId(null)}
className="bg-gray-400 text-white px-4 py-2 rounded-lg"
>
Cancel
</button>

</div>

</div>

)}

{/* LIST */}

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-xl font-semibold mb-4">
Upcoming Appointments
</h2>

<div className="space-y-3">

{visibleAppointments.map((a)=>(
<div
key={a.id}
className="border p-4 rounded-lg flex justify-between items-center"
>

<div>

<p className="font-semibold">
Patient: {a.patient}
</p>

<p className="text-sm text-gray-500">
Doctor: {a.doctor}
</p>

<p className="text-sm text-gray-500">
Reason: {a.reason}
</p>

</div>

<div className="text-right">

<p>
{a.date}
</p>

<p className="text-sm text-gray-500">
{a.time}
</p>

{/* ACTION BUTTONS */}

{(role === "admin" || role === "nurse") && (

<div className="flex gap-2 mt-2 justify-end">

<button
onClick={()=>handleEdit(a)}
className="bg-yellow-500 text-white p-2 rounded"
>
<Pencil size={16}/>
</button>

<button
onClick={()=>handleCancel(a.id)}
className="bg-red-500 text-white p-2 rounded"
>
<XCircle size={16}/>
</button>

</div>

)}

</div>

</div>
))}

</div>

</div>

</div>

);

}