const STORAGE_KEY = "patients";

export const getPatients = () => {

  const data = localStorage.getItem(STORAGE_KEY);

  if (data) return JSON.parse(data);

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

  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPatients));

  return defaultPatients;

};

export const savePatients = (patients) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
};

export const addPatient = (patient) => {

  const patients = getPatients();

  const updated = [...patients, patient];

  savePatients(updated);

  return updated;

};

export const deletePatient = (id) => {

  const patients = getPatients();

  const updated = patients.filter(p => p.id !== id);

  savePatients(updated);

  return updated;

};