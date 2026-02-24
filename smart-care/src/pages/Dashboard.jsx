import {
  Users,
  AlertTriangle,
  UserCheck,
  Bell
} from "lucide-react";

export default function Dashboard() {
  const mockPatients = [
    { id: "P001", name: "John Smith", age: 45, status: "stable" },
    { id: "P002", name: "Emma Johnson", age: 62, status: "critical" },
    { id: "P003", name: "Michael Brown", age: 30, status: "active" },
  ];

  const totalPatients = mockPatients.length;
  const criticalPatients = mockPatients.filter(p => p.status === "critical").length;
  const activePatients = mockPatients.filter(p => p.status === "active").length;

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-600">
          Real-time patient monitoring and statistics
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
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
        <h2 className="text-xl font-semibold mb-6">Recent Patients</h2>

        <div className="space-y-4">
          {mockPatients.map(patient => (
            <div
              key={patient.id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-semibold">{patient.name}</p>
                <p className="text-sm text-gray-500">
                  {patient.id} • Age {patient.age}
                </p>
              </div>

              <span className={`px-3 py-1 text-sm rounded-full ${
                patient.status === "critical"
                  ? "bg-red-100 text-red-700"
                  : patient.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {patient.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}