import { Link, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Shield,
  Calendar,
  FlaskConical,
  Pill,
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

  // 🎨 Theme per role
  const theme = {
    admin: {
      bg: "bg-gray-700",
      sub: "bg-gray-600",
      hover: "hover:text-gray-200"
    },
    doctor: {
      bg: "bg-blue-600",
      sub: "bg-blue-500",
      hover: "hover:text-blue-200"
    },
    nurse: {
      bg: "bg-pink-500",
      sub: "bg-pink-400",
      hover: "hover:text-pink-200"
    },
    patient: {
      bg: "bg-green-600",
      sub: "bg-green-500",
      hover: "hover:text-green-200"
    }
  };

  const currentTheme = theme[role] || theme.doctor;

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className={`w-64 text-white shadow-lg p-5 flex flex-col justify-between ${currentTheme.bg}`}>

        <div>

          <h1 className="text-3xl font-bold mb-10">
            Smart Care
          </h1>

          {/* User Info */}
          <div className={`mb-8 p-4 rounded-lg ${currentTheme.sub}`}>
            <p className="text-sm opacity-80">Logged in as</p>
            <p className="font-semibold truncate">{email}</p>

            <span className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-black/30">
              {role?.toUpperCase()}
            </span>
          </div>

          {/* Menu */}
          <nav className="space-y-4">

            {role === "admin" && (
              <Link to="/dashboard" className={`flex items-center gap-2 ${currentTheme.hover}`}>
                <LayoutDashboard size={18}/>
                Dashboard
              </Link>
            )}

            {(role === "admin" || role === "doctor" || role === "nurse") && (
              <Link to="/patients" className={`flex items-center gap-2 ${currentTheme.hover}`}>
                <Users size={18}/>
                Patients
              </Link>
            )}

            {(role === "admin" || role === "doctor" || role === "nurse") && (
              <Link to="/notes" className={`flex items-center gap-2 ${currentTheme.hover}`}>
                <FileText size={18}/>
                Medical Notes
              </Link>
            )}

            <Link to="/appointments" className={`flex items-center gap-2 ${currentTheme.hover}`}>
              <Calendar size={18}/>
              Appointments
            </Link>

            <Link to="/lab-results" className={`flex items-center gap-2 ${currentTheme.hover}`}>
              <FlaskConical size={18}/>
              Lab Results
            </Link>

            <Link to="/medications" className={`flex items-center gap-2 ${currentTheme.hover}`}>
              <Pill size={18}/>
              Medications
            </Link>

            {role === "admin" && (
              <Link to="/users" className={`flex items-center gap-2 ${currentTheme.hover}`}>
                <Shield size={18}/>
                User Management
              </Link>
            )}

          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          <LogOut size={16}/>
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