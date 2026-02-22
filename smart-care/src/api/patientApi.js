const BASE_URL = "http://localhost:5000/api"

export const getPatients = async () => {
  // จำลอง delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Somchai", status: "Critical" },
        { id: 2, name: "Anan", status: "Stable" },
        { id: 3, name: "Suda", status: "Stable" },
      ])
    }, 500)
  })
}

export const createPatient = async (data) => {
  const res = await fetch(`${BASE_URL}/patients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const deletePatient = async (id) => {
  await fetch(`${BASE_URL}/patients/${id}`, {
    method: "DELETE",
  })
}

export const updatePatient = async (id, data) => {
  const res = await fetch(`${BASE_URL}/patients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}