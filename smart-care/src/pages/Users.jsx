import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);

  // ดึงข้อมูลจาก backend (ตอนนี้ mock ไว้ก่อน)
  useEffect(() => {
    fetch("http://localhost:3000/api/users")  // เดี๋ยว backend ทำ route นี้
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <table className="w-full bg-white shadow rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t">
              <td className="p-3">{user.id}</td>
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3 text-center">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(user.id)}
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

  function handleDelete(id) {
    fetch(`http://localhost:3000/api/users/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
      });
  }
}