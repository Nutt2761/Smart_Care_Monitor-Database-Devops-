import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

export default function Patients() {
  const navigate = useNavigate();

  const mockPatients = [
    {
      id: "P001",
      name: "John Smith",
      age: 45,
      bloodType: "O+",
      status: "stable",
    },
    {
      id: "P002",
      name: "Emma Johnson",
      age: 62,
      bloodType: "A+",
      status: "critical",
    },
    {
      id: "P003",
      name: "Michael Brown",
      age: 30,
      bloodType: "B-",
      status: "active",
    },
  ];

  const getStatusStyle = (status) => {
    if (status === "critical")
      return "bg-red-600 text-white";
    if (status === "stable")
      return "bg-blue-600 text-white";
    if (status === "active")
      return "bg-green-600 text-white";
    return "bg-gray-500 text-white";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Patients</h1>
        <p className="text-gray-600">
          Manage and view patient information
        </p>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">
          All Patients
        </h2>

        <div className="space-y-4">
          {mockPatients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              {/* Left Section */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div>
                  <p className="font-semibold text-lg">
                    {patient.name}
                  </p>
                  <div className="text-sm text-gray-600 space-x-2">
                    <span>{patient.id}</span>
                    <span>•</span>
                    <span>Age {patient.age}</span>
                    <span>•</span>
                    <span>{patient.bloodType}</span>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                    patient.status
                  )}`}
                >
                  {patient.status}
                </span>

                <button
                  onClick={() =>
                    navigate(`/patients/${patient.id}`)
                  }
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Eye size={16} className="mr-2" />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}