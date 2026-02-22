import { useState } from "react";

export default function Patients() {
  const [patients, setPatients] = useState([
    { id: 1, name: "John Doe", age: 30 },
    { id: 2, name: "Jane Smith", age: 25 },
  ]);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [editId, setEditId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      setPatients(
        patients.map((p) =>
          p.id === editId ? { ...p, name, age } : p
        )
      );
      setEditId(null);
    } else {
      const newPatient = {
        id: Date.now(),
        name,
        age,
      };
      setPatients([...patients, newPatient]);
    }

    setName("");
    setAge("");
  };

  const handleEdit = (patient) => {
    setName(patient.name);
    setAge(patient.age);
    setEditId(patient.id);
  };

  const handleDelete = (id) => {
    setPatients(patients.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Patients</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Name"
          className="border p-2 mr-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age"
          className="border p-2 mr-2"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <button className="bg-blue-500 text-white px-4 py-2">
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Age</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td className="p-2 border">{patient.name}</td>
              <td className="p-2 border">{patient.age}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(patient)}
                  className="text-blue-500 mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(patient.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}