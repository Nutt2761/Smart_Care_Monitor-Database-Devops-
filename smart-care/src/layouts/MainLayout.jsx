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

  // 🎨 Theme ตาม role
  const theme = {
    admin: {
      sidebar: "bg-gray-700",
      card: "bg-gray-600",
      badge: "bg-gray-800",
      hover: "hover:text-gray-300"
    },
    doctor: {
      sidebar: "bg-blue-600",
      card: "bg-blue-500",
      badge: "bg-blue-800",
      hover: "hover:text-blue-200"
    },
    nurse: {
      sidebar: "bg-pink-500",
      card: "bg-pink-400",
      badge: "bg-pink-700",
      hover: "hover:text-pink-200"
    },
    patient: {
      sidebar: "bg-green-600",
      card: "bg-green-500",
      badge: "bg-green-800",
      hover: "hover:text-green-200"
    }
  };

  const currentTheme = theme[role] || theme.admin;

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className={`w-64 text-white shadow-lg p-5 flex flex-col justify-between ${currentTheme.sidebar}`}>

        <div>

          <h1 className="text-3xl font-bold mb-10">
            Smart Care
          </h1>

          {/* User Info */}
          <div className={`mb-8 p-4 rounded-lg ${currentTheme.card}`}>
            <p className="text-sm opacity-80">Logged in as</p>
            <p className="font-semibold truncate">{email}</p>

            <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${currentTheme.badge}`}>
              {role?.toUpperCase()}
            </span>
          </div>

          {/* Menu */}
          <nav className="space-y-4">

            {/* Dashboard */}
            {role === "admin" && (
              <Link to="/dashboard" className={`flex items-center gap-2 ${currentTheme.hover}`}>
                <LayoutDashboard size={18}/>
                Dashboard
              </Link>
            )}

            {/* Patients */}
            {(role === "admin" || role === "doctor" || role === "nurse") && (
              <Link to="/patients" className={`flex items-center gap-2 ${currentTheme.hover}`}>
                <Users size={18}/>
                Patients
              </Link>
            )}

            {/* Medical Notes ❌ admin ไม่เห็น */}
            {(role === "doctor" || role === "nurse") && (
              <Link to="/notes" className={`flex items-center gap-2 ${currentTheme.hover}`}>
                <FileText size={18}/>
                Medical Notes
              </Link>
            )}

            {/* Appointments */}
            <Link to="/appointments" className={`flex items-center gap-2 ${currentTheme.hover}`}>
              <Calendar size={18}/>
              Appointments
            </Link>

            {/* Lab Results */}
            <Link to="/lab-results" className={`flex items-center gap-2 ${currentTheme.hover}`}>
              <FlaskConical size={18}/>
              Lab Results
            </Link>

            {/* ✅ Medications (ไม่หายแล้ว) */}
            <Link to="/medications" className={`flex items-center gap-2 ${currentTheme.hover}`}>
              <Pill size={18}/>
              Medications
            </Link>

            {/* User Management */}
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