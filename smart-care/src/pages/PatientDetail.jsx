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
} from "lucide-react";

export default function PatientDetail() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);

  const thresholds = {
    heartRate: { min: 60, max: 100 },
    temperature: { min: 36, max: 37.5 },
    spo2: { min: 95, max: 100 },
    systolic: { min: 90, max: 140 },
    respiration: { min: 12, max: 20 },
  };

  const [vitals, setVitals] = useState({
    patientId: id,
    heartRate: 75,
    temperature: 36.6,
    spo2: 98,
    systolic: 120,
    diastolic: 80,
    respiration: 16,
    timestamp: new Date(),
  });

  useEffect(() => {

    const storedPatients =
      JSON.parse(localStorage.getItem("patients")) || [];

    const foundPatient = storedPatients.find((p) => p.id === id);

    setPatient(foundPatient);

  }, [id]);

  useEffect(() => {

    const interval = setInterval(() => {

      setVitals((prev) => ({
        ...prev,
        heartRate: prev.heartRate + (Math.random() - 0.5) * 6,
        temperature: prev.temperature + (Math.random() - 0.5) * 0.3,
        spo2: prev.spo2 + (Math.random() - 0.5) * 1,
        systolic: prev.systolic + (Math.random() - 0.5) * 6,
        diastolic: prev.diastolic + (Math.random() - 0.5) * 4,
        respiration: prev.respiration + (Math.random() - 0.5) * 2,
        timestamp: new Date(),
      }));

    }, 3000);

    return () => clearInterval(interval);

  }, [id]);

  const isAbnormal = (value, min, max) =>
    value < min || value > max;

  if (!patient) {
    return (
      <div className="p-6 text-red-600">
        Patient not found
      </div>
    );
  }

  const abnormal =
    isAbnormal(vitals.heartRate, thresholds.heartRate.min, thresholds.heartRate.max) ||
    isAbnormal(vitals.temperature, thresholds.temperature.min, thresholds.temperature.max) ||
    vitals.spo2 < thresholds.spo2.min ||
    isAbnormal(vitals.systolic, thresholds.systolic.min, thresholds.systolic.max) ||
    isAbnormal(vitals.respiration, thresholds.respiration.min, thresholds.respiration.max);

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
        {value} <span className="text-sm">{unit}</span>
      </p>

      {abnormal && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
          <AlertCircle size={12} />
          Abnormal
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-8">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:underline"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back
      </button>

      {/* Patient Info */}
      <div>

        <h1 className="text-3xl font-bold">
          {patient.fullName}
        </h1>

        <p className="text-gray-600">
          Patient ID: {patient.id}
        </p>

        <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">

          <p><b>Age:</b> {patient.age}</p>
          <p><b>Birth Date:</b> {patient.birthDate}</p>
          <p><b>Blood Type:</b> {patient.bloodType}</p>
          <p><b>Weight:</b> {patient.weight} kg</p>
          <p><b>Height:</b> {patient.height} cm</p>
          <p><b>Status:</b> {patient.status}</p>
          <p><b>Chronic Disease:</b> {patient.chronicDisease}</p>
          <p><b>Allergy:</b> {patient.allergyHistory}</p>
          <p><b>Medication:</b> {patient.currentMedication}</p>
          <p><b>Emergency Contact:</b> {patient.emergencyContact}</p>

        </div>

      </div>

      {(patient.status === "critical" || abnormal) && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          ⚠️ Patient requires attention
        </div>
      )}

      {/* Vital Signs */}
      <div className="bg-white shadow-md rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-6">
          Vital Signs (Live Monitoring)
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <Card
            title="Heart Rate"
            value={Math.round(vitals.heartRate)}
            unit="bpm"
            icon={<Heart />}
            abnormal={isAbnormal(
              vitals.heartRate,
              thresholds.heartRate.min,
              thresholds.heartRate.max
            )}
          />

          <Card
            title="Blood Pressure"
            value={`${Math.round(vitals.systolic)}/${Math.round(vitals.diastolic)}`}
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
            value={Math.round(vitals.respiration)}
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
            value={vitals.temperature.toFixed(1)}
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
            value={Math.round(vitals.spo2)}
            unit="%"
            icon={<Activity />}
            abnormal={vitals.spo2 < thresholds.spo2.min}
          />

        </div>

        <p className="text-xs text-gray-400 mt-6">
          Last Updated: {vitals.timestamp.toLocaleTimeString()}
        </p>

      </div>

    </div>
  );
}