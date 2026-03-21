import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Trash2, Edit, Plus } from "lucide-react";

export default function UserManagement() {
  const role = localStorage.getItem("role");
  const currentEmail = localStorage.getItem("email");

  if (role !== "admin") {
    return <Navigate to="/" />;
  }

  const API_URL = "http://localhost:5001/api/users";

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "doctor",
  });

  const [editingId, setEditingId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch(API_URL);
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to load users");
        return;
      }

      setUsers(data);
    } catch (err) {
      console.error(err);
      alert("Cannot connect to backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const roleBadge = (role) => {
    if (role === "admin") return "bg-red-100 text-red-700";
    if (role === "doctor") return "bg-blue-100 text-blue-700";
    if (role === "nurse") return "bg-green-100 text-green-700";
    if (role === "patient") return "bg-purple-100 text-purple-700";
    return "bg-gray-100 text-gray-700";
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password) {
      alert("Please fill email and password");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error");
        return;
      }

      setNewUser({
        email: "",
        password: "",
        role: "doctor",
      });

      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Cannot connect to backend");
    }
  };

  const handleDelete = async (id, email) => {
    if (email === currentEmail) {
      alert("You cannot delete yourself");
      return;
    }

    if (window.confirm("Delete this user?")) {
      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Error");
          return;
        }

        fetchUsers();
      } catch (err) {
        console.error(err);
        alert("Cannot connect to backend");
      }
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditedUser({
      email: user.email,
      role: user.role,
    });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error");
        return;
      }

      setEditingId(null);
      setEditedUser({});
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Cannot connect to backend");
    }
  };

  const toggleStatus = async (id) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    const newStatus = user.status === "active" ? "inactive" : "active";

    try {
      const res = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error");
        return;
      }

      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Cannot connect to backend");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>

      <input
        type="text"
        placeholder="Search user by email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-4 py-2 rounded-lg w-full md:w-1/3"
      />

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="font-semibold">Add New User</h2>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                email: e.target.value,
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
                password: e.target.value,
              })
            }
            className="border px-3 py-2 rounded"
          />

          <select
            value={newUser.role}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                role: e.target.value,
              })
            }
            className="border px-3 py-2 rounded"
          >
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
            <option value="patient">Patient</option>
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

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">All Users</h2>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center border-b pb-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {user.email.charAt(0).toUpperCase()}
                  </div>

                  <div>
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
                          className="border px-2 py-1 mb-1"
                        />

                        <select
                          value={editedUser.role}
                          onChange={(e) =>
                            setEditedUser({
                              ...editedUser,
                              role: e.target.value,
                            })
                          }
                          className="border px-2 py-1"
                        >
                          <option value="admin">Admin</option>
                          <option value="doctor">Doctor</option>
                          <option value="nurse">Nurse</option>
                          <option value="patient">Patient</option>
                        </select>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold">{user.email}</p>

                        <div className="flex items-center gap-2 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${roleBadge(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>

                          <span className="text-gray-500">
                            {user.status}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {editingId === user.id ? (
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <>
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
                        onClick={() => handleDelete(user.id, user.email)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <p className="text-gray-500">No users found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}