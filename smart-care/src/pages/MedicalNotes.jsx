import { useState } from "react";
import { FileText, Plus } from "lucide-react";

export default function MedicalNotes() {

  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  const [search, setSearch] = useState("");
  const [addendumFor, setAddendumFor] = useState(null);

  const [notes, setNotes] = useState([
    {
      id: 1,
      patientId: "P001",
      type: "Doctor Comment",
      content: "Patient shows improvement",
      author: "Dr. Smith",
      role: "doctor",
      timestamp: new Date(),
      parentNoteId: null,
    },
    {
      id: 2,
      patientId: "P002",
      type: "Nursing Note",
      content: "Vitals stable",
      author: "Nurse Anna",
      role: "nurse",
      timestamp: new Date(),
      parentNoteId: null,
    },
  ]);

  const [newNote, setNewNote] = useState({
    patientId: "",
    content: "",
  });

  const filteredNotes = notes.filter((note) =>
    note.patientId.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNote = () => {

    if (!newNote.patientId || !newNote.content) return;

    const type =
      role === "doctor" ? "Doctor Comment" : "Nursing Note";

    const note = {
      id: Date.now(),
      patientId: newNote.patientId,
      type,
      content: newNote.content,
      author: email,
      role,
      timestamp: new Date(),
      parentNoteId: null,
    };

    setNotes([note, ...notes]);

    setNewNote({
      patientId: "",
      content: "",
    });

  };

  const handleAddendum = (note) => {

    if (!newNote.content) return;

    const addendum = {
      id: Date.now(),
      patientId: note.patientId,
      type: "Addendum",
      content: newNote.content,
      author: email,
      role,
      timestamp: new Date(),
      parentNoteId: note.id,
    };

    setNotes([addendum, ...notes]);

    setAddendumFor(null);
    setNewNote({ ...newNote, content: "" });

  };

  const getTypeStyle = (type) =>
    type === "Doctor Comment"
      ? "bg-blue-50 border-blue-600"
      : type === "Nursing Note"
      ? "bg-green-50 border-green-600"
      : "bg-yellow-50 border-yellow-600";

  const getBadgeStyle = (type) =>
    type === "Doctor Comment"
      ? "bg-blue-600 text-white"
      : type === "Nursing Note"
      ? "bg-green-600 text-white"
      : "bg-yellow-600 text-white";

  const getRoleBadge = (role) => {

    if (role === "doctor")
      return "bg-blue-100 text-blue-700";

    if (role === "nurse")
      return "bg-green-100 text-green-700";

    return "bg-gray-100 text-gray-700";

  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          Medical Notes
        </h1>
        <p className="text-gray-600">
          Electronic medical record timeline
        </p>
      </div>

      {/* Add Note */}

      {(role === "doctor" || role === "nurse" || role === "admin") && (

        <div className="bg-white p-6 rounded-xl shadow space-y-4">

          <h2 className="flex items-center gap-2 font-semibold">
            <Plus size={16} /> Add Medical Note
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              placeholder="Patient ID"
              value={newNote.patientId}
              onChange={(e) =>
                setNewNote({
                  ...newNote,
                  patientId: e.target.value
                })
              }
              className="border px-3 py-2 rounded"
            />

            <input
              placeholder="Note content"
              value={newNote.content}
              onChange={(e) =>
                setNewNote({
                  ...newNote,
                  content: e.target.value
                })
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

      {/* Notes List */}

      <div className="bg-white shadow-md rounded-xl p-6">

        <div className="flex justify-between mb-6">

          <div className="flex items-center gap-2">
            <FileText size={20} />
            <h2 className="text-xl font-semibold">
              Medical Timeline
            </h2>
          </div>

          <input
            placeholder="Search Patient ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded"
          />

        </div>

        <div className="space-y-4">

          {filteredNotes.map((note) => (

            <div
              key={note.id}
              className={`p-4 rounded-lg border-l-4 ${getTypeStyle(note.type)}`}
            >

              <div className="flex justify-between mb-2">

                <div>

                  <span
                    className={`px-3 py-1 text-xs rounded-full ${getBadgeStyle(note.type)}`}
                  >
                    {note.type}
                  </span>

                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded-full ${getRoleBadge(note.role)}`}
                  >
                    {note.role}
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

              {/* Addendum */}

                <button
                  onClick={() =>
                    setAddendumFor(addendumFor === note.id ? null : note.id)
                  }
                  className="text-blue-600 text-sm mt-2"
                >
                {addendumFor === note.id ? "Cancel Addendum" : "Add Addendum"}
                </button>

              {addendumFor === note.id && (

                <div className="mt-3 space-y-2">

                  <input
                    placeholder="Add correction or update..."
                    value={newNote.content}
                    onChange={(e) =>
                      setNewNote({
                        ...newNote,
                        content: e.target.value
                      })
                    }
                    className="border px-3 py-2 rounded w-full"
                  />

                  <button
                    onClick={() => handleAddendum(note)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Save Addendum
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