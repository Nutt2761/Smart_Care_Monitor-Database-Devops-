import { useState, useEffect } from "react";
import {
  Heart,
  Droplet,
  Wind,
  Thermometer,
  Activity,
  AlertCircle,
} from "lucide-react";

export default function VitalSigns() {
  const thresholds = {
    heartRate: { min: 60, max: 100 },
    systolic: { min: 90, max: 140 },
    respiration: { min: 12, max: 20 },
    temperature: { min: 36.0, max: 37.5 },
    spo2: { min: 95, max: 100 },
  };

  const [vitals, setVitals] = useState({
    heartRate: 75,
    systolic: 120,
    diastolic: 80,
    respiration: 16,
    temperature: 36.6,
    spo2: 98,
  });

  const [alertMessage, setAlertMessage] = useState("");

  // simulate real-time update
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals((prev) => ({
        heartRate: prev.heartRate + (Math.random() - 0.5) * 5,
        systolic: prev.systolic + (Math.random() - 0.5) * 4,
        diastolic: prev.diastolic + (Math.random() - 0.5) * 3,
        respiration: prev.respiration + (Math.random() - 0.5) * 2,
        temperature: prev.temperature + (Math.random() - 0.5) * 0.2,
        spo2: prev.spo2 + (Math.random() - 0.5) * 1,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const isAbnormal = (value, min, max) => value < min || value > max;

  useEffect(() => {
    let alerts = [];

    if (isAbnormal(vitals.heartRate, thresholds.heartRate.min, thresholds.heartRate.max))
      alerts.push("Heart Rate out of range");

    if (isAbnormal(vitals.systolic, thresholds.systolic.min, thresholds.systolic.max))
      alerts.push("Blood Pressure out of range");

    if (isAbnormal(vitals.respiration, thresholds.respiration.min, thresholds.respiration.max))
      alerts.push("Respiration out of range");

    if (isAbnormal(vitals.temperature, thresholds.temperature.min, thresholds.temperature.max))
      alerts.push("Temperature out of range");

    if (vitals.spo2 < thresholds.spo2.min)
      alerts.push("SpO2 below normal");

    setAlertMessage(alerts.join(", "));
  }, [vitals]);

  const Card = ({ title, value, unit, icon, abnormal }) => (
    <div
      className={`p-6 rounded-xl shadow-lg transition ${
        abnormal
          ? "bg-red-50 border-2 border-red-500 animate-pulse"
          : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">{title}</h3>
        <div
          className={`p-3 rounded-lg ${
            abnormal ? "bg-red-100 text-red-600" : "bg-blue-50 text-blue-600"
          }`}
        >
          {icon}
        </div>
      </div>

      <div className="text-4xl font-bold">
        {value} <span className="text-xl font-normal">{unit}</span>
      </div>

      {abnormal && (
        <div className="mt-3 text-red-600 flex items-center gap-2 text-sm font-medium">
          <AlertCircle size={16} />
          Out of normal range
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vital Signs Monitoring</h1>
        <p className="text-gray-600">
          Real-time patient vital signs with automatic alerts
        </p>
      </div>

      {alertMessage && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          ⚠️ {alertMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="Heart Rate"
          value={Math.round(vitals.heartRate)}
          unit="bpm"
          icon={<Heart size={28} />}
          abnormal={isAbnormal(
            vitals.heartRate,
            thresholds.heartRate.min,
            thresholds.heartRate.max
          )}
        />

        <Card
          title="Blood Pressure"
          value={`${Math.round(vitals.systolic)}/${Math.round(
            vitals.diastolic
          )}`}
          unit="mmHg"
          icon={<Droplet size={28} />}
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
          icon={<Wind size={28} />}
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
          icon={<Thermometer size={28} />}
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
          icon={<Activity size={28} />}
          abnormal={vitals.spo2 < thresholds.spo2.min}
        />
      </div>
    </div>
  );
}
