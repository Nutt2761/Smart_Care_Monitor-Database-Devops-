import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2, Plus } from "lucide-react";
import { can } from "../utils/can";
import { getPatients, deletePatient } from "../services/patientService";

export default function Patients() {

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);

  useEffect(() => {

    const data = getPatients();
    setPatients(data);
    const storedPatients = JSON.parse(localStorage.getItem("patients"));

    if (storedPatients && storedPatients.length > 0) {
      setPatients(storedPatients);
    } else {

      const defaultPatients = [
        {
          id: "P001",
          fullName: "John Smith",
          age: 45,
          bloodType: "O+",
          chronicDisease: "Hypertension",
          status: "stable",
        },
        {
          id: "P002",
          fullName: "Emma Johnson",
          age: 62,
          bloodType: "A+",
          chronicDisease: "Diabetes",
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

  if (!can("deletePatient")) return;

  if (window.confirm("Are you sure?")) {

    const updated = deletePatient(id);
    setPatients(updated);

  }

};

  const filteredPatients = patients.filter((patient) => {

    const keyword = search.toLowerCase();

    return (
      patient.fullName.toLowerCase().includes(keyword) ||
      patient.id.toLowerCase().includes(keyword)
    );

  });

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">Patients</h1>
          <p className="text-gray-600">
            Manage and view patient medical records
          </p>
        </div>

        {can("addPatient") && (
          <button
            onClick={() => navigate("/patients/add")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} className="mr-2" />
            Add Patient
          </button>
        )}

      </div>

      {/* Search */}

      <input
        type="text"
        placeholder="Search by name or patient ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/3 px-4 py-2 border rounded-lg"
      />

      {/* Patient List */}

      <div className="bg-white shadow-md rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-6">
          All Patients
        </h2>

        {filteredPatients.length === 0 && (

          <div className="text-center text-gray-500 py-10">
            No patients found
          </div>

        )}

        <div className="space-y-4">

          {filteredPatients.map((patient) => (

            <div
              key={patient.id}
              className={`flex items-center justify-between p-4 rounded-lg 
              ${patient.status === "critical"
                ? "bg-red-50 border border-red-200"
                : "bg-gray-50"}`}
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

                {can("deletePatient") && (

                  <button
                    onClick={() => handleDelete(patient.id)}
                    className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>

                )}

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}