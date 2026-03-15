import { Link, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Shield,
  Calendar,
  LogOut
} from "lucide-react";

export default function MainLayout() {

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-blue-600 text-white shadow-lg p-5 flex flex-col justify-between">

        <div>
          <h1 className="text-3xl font-bold mb-10">
            Smart Care
          </h1>

          <div className="mb-8 bg-blue-500 p-4 rounded-lg">
            <p className="text-sm opacity-80">Logged in as</p>
            <p className="font-semibold truncate">{email}</p>

            <span className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-800">
              {role?.toUpperCase()}
            </span>
          </div>

          <nav className="space-y-4">

            {role === "admin" && (
              <Link to="/" className="flex items-center gap-2 hover:text-blue-200">
                <LayoutDashboard size={18}/>
                Dashboard
              </Link>
            )}

            <Link to="/patients" className="flex items-center gap-2 hover:text-blue-200">
              <Users size={18}/>
              Patients
            </Link>

            <Link to="/notes" className="flex items-center gap-2 hover:text-blue-200">
              <FileText size={18}/>
              Medical Notes
            </Link>

            <Link to="/appointments" className="flex items-center gap-2 hover:text-blue-200">
              <Calendar size={18}/>
              Appointments
            </Link>

            {role === "admin" && (
              <Link to="/users" className="flex items-center gap-2 hover:text-blue-200">
                <Shield size={18}/>
                User Management
              </Link>
            )}

          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          <LogOut size={16}/>
          Logout
        </button>

      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
}