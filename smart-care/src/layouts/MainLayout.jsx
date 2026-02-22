import { Link, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, FileText } from "lucide-react";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-5">
        <h1 className="text-2xl font-bold text-blue-600 mb-10">
          Smart Care
        </h1>

        <nav className="space-y-4">
          <Link to="/" className="flex items-center gap-2 hover:text-blue-500">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link to="/patients" className="flex items-center gap-2 hover:text-blue-500">
            <Users size={18} />
            Patients
          </Link>

          <Link to="/reports" className="flex items-center gap-2 hover:text-blue-500">
            <FileText size={18} />
            Reports
          </Link>
        </nav>
                    <button
            onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }}
            className="mt-10 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
            >
            Logout
            </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
}