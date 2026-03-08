import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2, Plus } from "lucide-react";

// คนไข้
export default function Patients() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [patients, setPatients] = useState([ // อันนี้ set ค่าเริ่มต้นมาก่อนเฉยๆ 
    {
      id: "P001", // ID 
      fullName: "John Smith", //ชือ
      birthDate: "1980-05-10", //วันเกิด
      age: 45, //อายุ
      weight: 78, //น้ำหนัก
      height: 175, //ส่วนสูง
      bloodType: "O+", // กรุ๊ปเลือด
      chronicDisease: "Hypertension", //โรคเรื้อรัง
      allergyHistory: "Penicillin", //ประวัติการแพ้
      currentMedication: "Amlodipine", //ยาที่ต้องทานปัจุบัน
      emergencyContact: "0812345678", //เบอร์โทร์ฉุกเฉิน
      status: "stable", //สถานะ
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
  ]);

  // สถานะ จะมีอยู่ 3 สถานะคือ critical(วิกฤต,อันตราย) , stable(คงที่) ,active(กำลังรักษา)
  const getStatusStyle = (status) => {
    if (status === "critical") //critical(วิกฤต,อันตราย)
      return "bg-red-600 text-white";
    if (status === "stable") //stable(คงที่)
      return "bg-blue-600 text-white";
    if (status === "active") //active(กำลังรักษา)
      return "bg-green-600 text-white";
    return "bg-gray-500 text-white";
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      setPatients(patients.filter((p) => p.id !== id));
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.fullName.toLowerCase().includes(search.toLowerCase())
  );

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

        <button
          onClick={() => alert("Add Patient Form (next step)")}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" />
          Add Patient
        </button>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Patient List */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">
          All Patients
        </h2>

        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              {/* Left Section */}
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
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Eye size={16} className="mr-2" />
                  View
                </button>

                <button
                  onClick={() => handleDelete(patient.id)}
                  className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {filteredPatients.length === 0 && (
            <p className="text-gray-500 text-center">
              No patients found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}