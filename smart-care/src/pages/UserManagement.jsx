import { Navigate } from "react-router-dom";

export default function UserManagement() {
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">User Management</h1>
    </div>
  );
}