import { useState } from "react";
import { FileText, Plus } from "lucide-react";

export default function MedicalNotes() {

  const role = localStorage.getItem("role");

  const [notes, setNotes] = useState([
    {
      id: 1,
      type: "Doctor Comment",
      patientId: "P001",
      author: "Dr. Smith",
      timestamp: new Date(),
      content: "Patient shows improvement.",
    },
    {
      id: 2,
      type: "Nursing Note",
      patientId: "P002",
      author: "Nurse Anna",
      timestamp: new Date(),
      content: "Vitals stable.",
    },
  ]);

  const [newNote, setNewNote] = useState({
    patientId: "",
    type: "Doctor Comment",
    content: "",
  });

  const handleAddNote = () => {
    if (!newNote.patientId || !newNote.content) return;

    const note = {
      id: Date.now(),
      ...newNote,
      author: localStorage.getItem("email"),
      timestamp: new Date(),
    };

    setNotes([note, ...notes]);

    setNewNote({
      patientId: "",
      type: "Doctor Comment",
      content: "",
    });
  };

  const getTypeStyle = (type) =>
    type === "Doctor Comment"
      ? "bg-blue-50 border-blue-600"
      : "bg-green-50 border-green-600";

  const getBadgeStyle = (type) =>
    type === "Doctor Comment"
      ? "bg-blue-600 text-white"
      : "bg-green-600 text-white";

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">Medical Notes</h1>
        <p className="text-gray-600">
          Manage medical records across patients
        </p>
      </div>

      {/* ✅ Add Note (เฉพาะ doctor/admin) */}
      {(role === "doctor" || role === "admin") && (
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Plus size={16} /> Add Medical Note
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              placeholder="Patient ID"
              value={newNote.patientId}
              onChange={(e) =>
                setNewNote({ ...newNote, patientId: e.target.value })
              }
              className="border px-3 py-2 rounded"
            />

            <select
              value={newNote.type}
              onChange={(e) =>
                setNewNote({ ...newNote, type: e.target.value })
              }
              className="border px-3 py-2 rounded"
            >
              <option>Doctor Comment</option>
              <option>Nursing Note</option>
            </select>

            <input
              placeholder="Note Content"
              value={newNote.content}
              onChange={(e) =>
                setNewNote({ ...newNote, content: e.target.value })
              }
              className="border px-3 py-2 rounded"
            />
          </div>

          <button
            onClick={handleAddNote}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Save Note
          </button>
        </div>
      )}

      {/* ✅ Notes List */}
      <div className="bg-white shadow-md rounded-xl p-6">

        <div className="flex items-center gap-2 mb-6">
          <FileText size={20} />
          <h2 className="text-xl font-semibold">
            All Medical Notes
          </h2>
        </div>

        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-lg border-l-4 ${getTypeStyle(
                note.type
              )}`}
            >
              <div className="flex justify-between mb-2">
                <div>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${getBadgeStyle(
                      note.type
                    )}`}
                  >
                    {note.type}
                  </span>

                  <p className="text-sm mt-1">
                    Patient: {note.patientId}
                  </p>

                  <p className="text-sm font-medium">
                    {note.author}
                  </p>
                </div>

                <p className="text-sm text-gray-500">
                  {new Date(note.timestamp).toLocaleString()}
                </p>
              </div>

              <p>{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}