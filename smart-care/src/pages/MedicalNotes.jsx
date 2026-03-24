import { useEffect, useState } from "react";
import { FileText, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Navigate } from "react-router-dom";

export default function MedicalNotes() {
  const role = localStorage.getItem("role");

  if (role === "patient") {
    return <Navigate to="/dashboard" />;
  }

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newNote, setNewNote] = useState({
    patientId: "",
    doctorName: "",
    content: "",
  });

  const API_URL = "http://localhost:5001/api/medical-notes";

  const fetchNotes = async (patientId = "") => {
    try {
      setLoading(true);

      const url = patientId
        ? `${API_URL}?patientId=${encodeURIComponent(patientId)}`
        : API_URL;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch notes");
      }

      setNotes(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchNotes(search);
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  const handleAddNote = async () => {
    if (!newNote.patientId || !newNote.content || !newNote.doctorName) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add note");
      }

      setNotes((prev) => [data, ...prev]);

      setNewNote({
        patientId: "",
        doctorName: "",
        content: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to save note");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete note");
      }

      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete note");
    }
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setEditedContent(note.content);
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update note");
      }

      setNotes((prev) =>
        prev.map((note) => (note.id === id ? data : note))
      );

      setEditingId(null);
      setEditedContent("");
    } catch (error) {
      console.error(error);
      alert("Failed to update note");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Medical Notes</h1>
        <p className="text-gray-600">Electronic medical record timeline</p>
      </div>

      {role === "doctor" && (
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="flex items-center gap-2 font-semibold">
            <Plus size={16} /> Add Medical Note
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              placeholder="Patient ID"
              value={newNote.patientId}
              onChange={(e) =>
                setNewNote({
                  ...newNote,
                  patientId: e.target.value,
                })
              }
              className="border px-3 py-2 rounded"
            />

            <input
              placeholder="Doctor Name"
              value={newNote.doctorName}
              onChange={(e) =>
                setNewNote({
                  ...newNote,
                  doctorName: e.target.value,
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
                  content: e.target.value,
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

      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="flex justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText size={20} />
            <h2 className="text-xl font-semibold">Medical Timeline</h2>
          </div>

          <input
            placeholder="Search Patient ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-lg border-l-4 bg-blue-50 border-blue-600"
              >
                <div className="flex justify-between mb-2">
                  <div>
                    <span className="px-3 py-1 text-xs rounded-full bg-blue-600 text-white">
                      {note.type}
                    </span>

                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      {note.role}
                    </span>

                    <p className="text-sm mt-1">Patient: {note.patientId}</p>

                    <p className="text-sm font-medium">{note.author}</p>
                  </div>

                  <p className="text-sm text-gray-500">
                    {new Date(note.timestamp).toLocaleString()}
                  </p>
                </div>

                {editingId === note.id ? (
                  <div className="flex gap-2 mt-2">
                    <input
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="border px-3 py-1 rounded w-full"
                    />

                    <button
                      onClick={() => handleSave(note.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      <Save size={16} />
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditedContent("");
                      }}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <p className="mt-2">{note.content}</p>
                )}

                {(role === "admin" || role === "doctor") && (
                  <div className="flex gap-2 mt-3">
                    {editingId !== note.id && (
                      <button
                        onClick={() => handleEdit(note)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        <Edit size={16} />
                      </button>
                    )}

                    {role === "admin" && (
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}