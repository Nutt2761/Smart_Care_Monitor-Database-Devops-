import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Trash2, Edit, Save, X, Plus } from "lucide-react";

export default function UserManagement() {

  const role = localStorage.getItem("role");
  const currentEmail = localStorage.getItem("email");

  if (role !== "admin") {
    return <Navigate to="/" />;
  }

  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([
    { id: 1, email: "admin@mail.com", role: "admin", status: "Active" },
    { id: 2, email: "doctor@mail.com", role: "doctor", status: "Active" },
    { id: 3, email: "nurse@gmail.com", role: "nurse", status: "Active" },
  ]);

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "doctor",
  });

  const [editingId, setEditingId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  const roleBadge = (role) => {
    if (role === "admin") return "bg-red-100 text-red-700";
    if (role === "doctor") return "bg-blue-100 text-blue-700";
    if (role === "nurse") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  // 🔹 Add User
  const handleAddUser = () => {

    if (!newUser.email || !newUser.password) return;

    const exists = users.some((u) => u.email === newUser.email);

    if (exists) {
      alert("User already exists");
      return;
    }

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

  // 🔹 Delete
  const handleDelete = (id, email) => {

    if (email === currentEmail) {
      alert("You cannot delete yourself");
      return;
    }

    if (window.confirm("Delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
    }

  };

  // 🔹 Edit
  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditedUser(user);
  };

  const handleSave = () => {

    setUsers(
      users.map((u) =>
        u.id === editingId ? editedUser : u
      )
    );

    setEditingId(null);

  };

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

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        User Management
      </h1>

      {/* 🔍 Search */}

      <input
        type="text"
        placeholder="Search user by email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-4 py-2 rounded-lg w-full md:w-1/3"
      />

      {/* ➕ Add User */}

      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        <h2 className="font-semibold">
          Add New User
        </h2>

        <div className="grid md:grid-cols-4 gap-4">

          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                email: e.target.value
              })
            }
            className="border px-3 py-2 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                password: e.target.value
              })
            }
            className="border px-3 py-2 rounded"
          />

          <select
            value={newUser.role}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                role: e.target.value
              })
            }
            className="border px-3 py-2 rounded"
          >
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
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

      {/* 👥 User List */}

      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="font-semibold mb-4">
          All Users
        </h2>

        <div className="space-y-4">

          {filteredUsers.map((user) => (

            <div
              key={user.id}
              className="flex justify-between items-center border-b pb-4"
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
                    <option value="nurse">Nurse</option>
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

                  <div className="flex items-center gap-3">

                    {/* Avatar */}

                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {user.email.charAt(0).toUpperCase()}
                    </div>

                    <div>

                      <p className="font-semibold">
                        {user.email}
                      </p>

                      <div className="flex items-center gap-2 text-sm">

                        <span
                          className={`px-2 py-1 rounded-full text-xs ${roleBadge(user.role)}`}
                        >
                          {user.role}
                        </span>

                        <span className="text-gray-500">
                          {user.status}
                        </span>

                      </div>

                    </div>

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