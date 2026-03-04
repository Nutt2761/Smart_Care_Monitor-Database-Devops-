import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Trash2, Edit, Save, X, Plus } from "lucide-react";

export default function UserManagement() {
  const role = localStorage.getItem("role");
  const currentEmail = localStorage.getItem("email");

  if (role !== "admin") {
    return <Navigate to="/" />;
  }

  const [users, setUsers] = useState([
    { id: 1, email: "admin@mail.com", role: "admin", status: "Active" },
    { id: 2, email: "doctor@mail.com", role: "doctor", status: "Active" },
  ]);

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "doctor",
  });

  const [editingId, setEditingId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  // ✅ Add User
  const handleAddUser = () => {
    if (!newUser.email || !newUser.password) return;

    const user = {
      id: Date.now(),
      email: newUser.email,
      role: newUser.role,
      status: "Active",
    };

    setUsers([...users, user]);

    setNewUser({
      email: "",
      password: "",
      role: "doctor",
    });
  };

  // ✅ Delete User
  const handleDelete = (id, email) => {
    if (email === currentEmail) {
      alert("You cannot delete yourself");
      return;
    }

    if (window.confirm("Delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  // ✅ Start Editing
  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditedUser(user);
  };

  // ✅ Save Edit
  const handleSave = () => {
    setUsers(
      users.map((u) =>
        u.id === editingId ? editedUser : u
      )
    );
    setEditingId(null);
  };

  // ✅ Toggle Status
  const toggleStatus = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === "Active" ? "Inactive" : "Active",
            }
          : u
      )
    );
  };

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        User Management (Admin)
      </h1>

      {/* 🔹 Add User */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="font-semibold">Add New User</h2>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
            className="border px-3 py-2 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            className="border px-3 py-2 rounded"
          />

          <select
            value={newUser.role}
            onChange={(e) =>
              setNewUser({ ...newUser, role: e.target.value })
            }
            className="border px-3 py-2 rounded"
          >
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
          </select>

          <button
            onClick={handleAddUser}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* 🔹 User List */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">All Users</h2>

        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center border-b pb-3"
            >
              {editingId === user.id ? (
                <>
                  <input
                    value={editedUser.email}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        email: e.target.value,
                      })
                    }
                    className="border px-2 py-1 rounded"
                  />

                  <select
                    value={editedUser.role}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        role: e.target.value,
                      })
                    }
                    className="border px-2 py-1 rounded"
                  >
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                  </select>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      <Save size={16} />
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="font-semibold">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      Role: {user.role} | Status: {user.status}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleStatus(user.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Toggle
                    </button>

                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(user.id, user.email)
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}