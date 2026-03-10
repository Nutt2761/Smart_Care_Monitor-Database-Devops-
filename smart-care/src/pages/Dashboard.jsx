import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  AlertTriangle,
  UserCheck,
  Bell
} from "lucide-react";
import { getPatients } from "../services/patientService";

export default function Dashboard() {

  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);

  useEffect(() => {

  const data = getPatients();
  setPatients(data);

}, []);

  const totalPatients = patients.length;

  const criticalPatients = patients.filter(
    p => p.status === "critical"
  ).length;

  const activePatients = patients.filter(
    p => p.status === "active"
  ).length;

  const statCards = [
    {
      title: "Total Patients",
      value: totalPatients,
      icon: <Users size={28} />,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Critical Patients",
      value: criticalPatients,
      icon: <AlertTriangle size={28} />,
      color: "text-red-600",
      bg: "bg-red-50"
    },
    {
      title: "Active Patients",
      value: activePatients,
      icon: <UserCheck size={28} />,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "Latest Alerts",
      value: criticalPatients,
      icon: <Bell size={28} />,
      color: "text-orange-600",
      bg: "bg-orange-50"
    }
  ];

  const sortedPatients = [...patients].sort(
    (a, b) => (a.status === "critical" ? -1 : 1)
  );

  const recentPatients = sortedPatients.slice(0, 5);

  const getStatusColor = (status) => {

    if (status === "critical") return "bg-red-100 text-red-700";
    if (status === "active") return "bg-green-100 text-green-700";

    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          Dashboard Overview
        </h1>

        <p className="text-gray-600">
          Real-time patient monitoring and statistics
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Logged in as: <span className="font-semibold">{role}</span>
        </p>
      </div>

      {/* Critical Alert */}

      {criticalPatients > 0 && (

        <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg flex items-center">

          <AlertTriangle className="mr-3" />

          <span className="font-semibold">
            {criticalPatients} Critical Patient{criticalPatients > 1 ? "s" : ""} Require Attention
          </span>

        </div>

      )}

      {/* Stat Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {statCards.map((stat, index) => (

          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
          >

            <div className="flex justify-between items-center">

              <div>
                <p className="text-sm text-gray-500">
                  {stat.title}
                </p>

                <p className={`text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>

              <div className={`${stat.bg} p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Recent Patients */}

      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-semibold mb-6">
          Recent Patients
        </h2>

        {recentPatients.length === 0 && (

          <div className="text-center text-gray-500 py-10">
            No patients found
          </div>

        )}

        <div className="space-y-4">

          {recentPatients.map(patient => (

            <div
              key={patient.id}
              onClick={() => navigate(`/patients/${patient.id}`)}
              className={`flex justify-between items-center p-4 rounded-lg cursor-pointer transition
              ${patient.status === "critical"
                ? "bg-red-50 border border-red-200 hover:bg-red-100"
                : "bg-gray-50 hover:bg-gray-100"
              }`}
            >

              <div>

                <p className="font-semibold">
                  {patient.fullName || patient.name}
                </p>

                <p className="text-sm text-gray-500">
                  {patient.id} • Age {patient.age}
                </p>

              </div>

              <span
                className={`px-3 py-1 text-sm rounded-full ${getStatusColor(patient.status)}`}
              >
                {patient.status}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}