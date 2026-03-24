const API_URL = "http://localhost:5001/api/vitals";

export const getVitalsByPatientId = async (patientId) => {
  const res = await fetch(`${API_URL}/patient/${patientId}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch vital signs");
  }

  return data;
};

export const addVitalSign = async (vitalData) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vitalData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to add vital sign");
  }

  return data;
};