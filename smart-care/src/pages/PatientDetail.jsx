import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  Thermometer,
  Activity,
  Droplet,
  Wind,
  AlertCircle,
  Plus,
} from "lucide-react";
import { getPatientById } from "../services/patientService";
import { getVitalsByPatientId } from "../services/VitalService";

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const thresholds = {
    heartRate: { min: 60, max: 100 },
    temperature: { min: 36, max: 37.5 },
    spo2: { min: 95, max: 100 },
    systolic: { min: 90, max: 140 },
    respiration: { min: 12, max: 20 },
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "-";

    const today = new Date();
    const dob = new Date(birthDate);

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dob.getDate())
    ) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const patientData = await getPatientById(id);
        setPatient(patientData);

        const vitalsData = await getVitalsByPatientId(id);
        setVitals(vitalsData.length > 0 ? vitalsData[0] : null);
      } catch (err) {
        console.error("PATIENT DETAIL ERROR:", err);
        setError("Cannot load patient detail");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const isAbnormal = (value, min, max) => {
    if (value === null || value === undefined || value === "") return false;
    return value < min || value > max;
  };

  const abnormal =
    vitals &&
    (
      isAbnormal(vitals.heart_rate, thresholds.heartRate.min, thresholds.heartRate.max) ||
      isAbnormal(vitals.temperature, thresholds.temperature.min, thresholds.temperature.max) ||
      (vitals.spo2 !== null && vitals.spo2 < thresholds.spo2.min) ||
      isAbnormal(vitals.systolic, thresholds.systolic.min, thresholds.systolic.max) ||
      isAbnormal(vitals.respiration, thresholds.respiration.min, thresholds.respiration.max)
    );

  const Card = ({ title, value, unit, icon, abnormal }) => (
    <div
      className={`p-4 rounded-lg border ${
        abnormal
          ? "bg-red-50 border-red-500"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span>{title}</span>
      </div>

      <p className="text-2xl font-bold">
        {value ?? "-"} <span className="text-sm">{unit}</span>
      </p>

      {abnormal && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
          <AlertCircle size={12} />
          Abnormal
        </p>
      )}
    </div>
  );

  if (loading) {
    return <div className="p-6 text-gray-500">Loading patient detail...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!patient) {
    return <div className="p-6 text-red-600">Patient not found</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </button>

        <button
          onClick={() => navigate(`/patients/${id}/vitals/add`)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" />
          Add Vital Sign
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">{patient.full_name}</h1>

        <p className="text-gray-600">
          Patient ID: {patient.patient_code}
        </p>

        <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
          <p><b>Age:</b> {calculateAge(patient.birth_date)}</p>
          <p><b>Birth Date:</b> {patient.birth_date?.slice(0, 10)}</p>
          <p><b>Blood Type:</b> {patient.blood_type || "-"}</p>
          <p><b>Weight:</b> {patient.weight || "-"} kg</p>
          <p><b>Height:</b> {patient.height || "-"} cm</p>
          <p><b>Status:</b> {patient.status}</p>
          <p><b>Chronic Disease:</b> {patient.chronic_disease || "-"}</p>
          <p><b>Allergy:</b> {patient.allergy || "-"}</p>
          <p><b>Emergency Contact:</b> {patient.emergency_contact || "-"}</p>
        </div>
      </div>

      {(patient.status === "critical" || abnormal) && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          ⚠️ Patient requires attention
        </div>
      )}

      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">
          Latest Vital Signs
        </h2>

        {!vitals ? (
          <p className="text-gray-500">No vital signs recorded yet</p>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              <Card
                title="Heart Rate"
                value={vitals.heart_rate}
                unit="bpm"
                icon={<Heart />}
                abnormal={isAbnormal(
                  vitals.heart_rate,
                  thresholds.heartRate.min,
                  thresholds.heartRate.max
                )}
              />

              <Card
                title="Blood Pressure"
                value={
                  vitals.systolic != null && vitals.diastolic != null
                    ? `${vitals.systolic}/${vitals.diastolic}`
                    : "-"
                }
                unit="mmHg"
                icon={<Droplet />}
                abnormal={isAbnormal(
                  vitals.systolic,
                  thresholds.systolic.min,
                  thresholds.systolic.max
                )}
              />

              <Card
                title="Respiration"
                value={vitals.respiration}
                unit="/min"
                icon={<Wind />}
                abnormal={isAbnormal(
                  vitals.respiration,
                  thresholds.respiration.min,
                  thresholds.respiration.max
                )}
              />

              <Card
                title="Temperature"
                value={vitals.temperature}
                unit="°C"
                icon={<Thermometer />}
                abnormal={isAbnormal(
                  vitals.temperature,
                  thresholds.temperature.min,
                  thresholds.temperature.max
                )}
              />

              <Card
                title="SpO2"
                value={vitals.spo2}
                unit="%"
                icon={<Activity />}
                abnormal={vitals.spo2 != null && vitals.spo2 < thresholds.spo2.min}
              />
            </div>

            <p className="text-xs text-gray-400 mt-6">
              Last Updated: {new Date(vitals.recorded_at).toLocaleString()}
            </p>
          </>
        )}
      </div>
    </div>
  );
}