import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allow }) {
  const role = localStorage.getItem("role");

  // ยังไม่ได้ login
  if (!role) {
    return <Navigate to="/login" />;
  }

  // role ไม่ตรง
  if (allow && !allow.includes(role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}