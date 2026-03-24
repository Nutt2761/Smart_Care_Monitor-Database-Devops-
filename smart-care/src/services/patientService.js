const API_URL = "http://localhost:5001/api/patients";

export const getPatients = async () => {
  const res = await fetch(API_URL);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch patients");
  }

  return data;
};

export const getPatientById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch patient");
  }

  return data;
};

export const addPatient = async (patientData) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patientData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to add patient");
  }

  return data;
};

export const deletePatient = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete patient");
  }

  return data;
};