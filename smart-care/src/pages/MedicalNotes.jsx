import { FileText } from "lucide-react";

export default function MedicalNotes() {
  const mockMedicalNotes = [
    {
      id: 1,
      type: "doctor",
      patientId: "P001",
      author: "Dr. Smith",
      timestamp: new Date(),
      content: "Patient shows improvement. Continue current medication.",
    },
    {
      id: 2,
      type: "nurse",
      patientId: "P002",
      author: "Nurse Anna",
      timestamp: new Date(),
      content: "Vitals stable. No abnormal symptoms observed.",
    },
  ];

  const getTypeStyle = (type) => {
    return type === "doctor"
      ? "bg-blue-50 border-blue-600"
      : "bg-green-50 border-green-600";
  };

  const getBadgeStyle = (type) => {
    return type === "doctor"
      ? "bg-blue-600 text-white"
      : "bg-green-600 text-white";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Medical Notes</h1>
        <p className="text-gray-600">
          View all medical notes across patients
        </p>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText size={20} />
          <h2 className="text-xl font-semibold">
            All Medical Notes
          </h2>
        </div>

        <div className="space-y-4">
          {mockMedicalNotes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-lg border-l-4 ${getTypeStyle(
                note.type
              )}`}
            >
              <div className="flex justify-between mb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-xs rounded-full capitalize ${getBadgeStyle(
                        note.type
                      )}`}
                    >
                      {note.type}
                    </span>
                    <span className="text-sm text-gray-600">
                      Patient: {note.patientId}
                    </span>
                  </div>
                  <p className="text-sm font-medium">
                    {note.author}
                  </p>
                </div>

                <p className="text-sm text-gray-500">
                  {new Date(note.timestamp).toLocaleString()}
                </p>
              </div>

              <p className="text-gray-800">
                {note.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}