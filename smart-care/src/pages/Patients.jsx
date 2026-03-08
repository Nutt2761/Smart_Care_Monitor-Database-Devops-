import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2, Plus } from "lucide-react";

export default function Patients() {

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [patients, setPatients] = useState([]);

  useEffect(() => {

    const storedPatients = JSON.parse(localStorage.getItem("patients"));

    if (storedPatients && storedPatients.length > 0) {
      setPatients(storedPatients);
    } else {
      const defaultPatients = [
        {
          id: "P001",
          fullName: "John Smith",
          birthDate: "1980-05-10",
          age: 45,
          weight: 78,
          height: 175,
          bloodType: "O+",
          chronicDisease: "Hypertension",
          allergyHistory: "Penicillin",
          currentMedication: "Amlodipine",
          emergencyContact: "0812345678",
          status: "stable",
        },
        {
          id: "P002",
          fullName: "Emma Johnson",
          birthDate: "1963-09-20",
          age: 62,
          weight: 65,
          height: 160,
          bloodType: "A+",
          chronicDisease: "Diabetes",
          allergyHistory: "None",
          currentMedication: "Metformin",
          emergencyContact: "0898765432",
          status: "critical",
        },
      ];

      setPatients(defaultPatients);
      localStorage.setItem("patients", JSON.stringify(defaultPatients));
    }

  }, []);

  const getStatusStyle = (status) => {
    if (status === "critical") return "bg-red-600 text-white";
    if (status === "stable") return "bg-blue-600 text-white";
    if (status === "active") return "bg-green-600 text-white";
    return "bg-gray-500 text-white";
  };

  const handleDelete = (id) => {

    if (window.confirm("Are you sure you want to delete this patient?")) {

      const updated = patients.filter((p) => p.id !== id);

      setPatients(updated);

      localStorage.setItem("patients", JSON.stringify(updated));

    }

  };

  const filteredPatients = patients.filter((patient) =>
    patient.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patients</h1>
          <p className="text-gray-600">
            Manage and view patient medical records
          </p>
        </div>

        <button
          onClick={() => navigate("/patients/add")}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" />
          Add Patient
        </button>
      </div>

      <input
        type="text"
        placeholder="Search patient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/3 px-4 py-2 border rounded-lg"
      />

      <div className="bg-white shadow-md rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-6">
          All Patients
        </h2>

        <div className="space-y-4">

          {filteredPatients.map((patient) => (

            <div
              key={patient.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >

              <div className="flex items-center space-x-4">

                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {patient.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div>

                  <p className="font-semibold text-lg">
                    {patient.fullName}
                  </p>

                  <div className="text-sm text-gray-600 space-x-2">
                    <span>{patient.id}</span>
                    <span>•</span>
                    <span>Age {patient.age}</span>
                    <span>•</span>
                    <span>{patient.bloodType}</span>
                    <span>•</span>
                    <span>{patient.chronicDisease}</span>
                  </div>

                </div>
              </div>

              <div className="flex items-center space-x-4">

                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                    patient.status
                  )}`}
                >
                  {patient.status}
                </span>

                <button
                  onClick={() => navigate(`/patients/${patient.id}`)}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg"
                >
                  <Eye size={16} className="mr-2" />
                  View
                </button>

                <button
                  onClick={() => handleDelete(patient.id)}
                  className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg"
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}