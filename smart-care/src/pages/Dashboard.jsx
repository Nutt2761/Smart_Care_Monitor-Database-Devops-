import { useEffect, useState } from "react"
import { getPatients } from "../api/patientApi"
import StatCard from "../components/StatCard"

export default function Dashboard() {

  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")
  const [newName, setNewName] = useState("")

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getPatients()
        setPatients(data)
      } catch (err) {
        setError("Failed to fetch patients")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // เพิ่มผู้ป่วย (mock ก่อน)
  const addPatient = () => {
    if (!newName) return

    const newPatient = {
      id: Date.now(),
      name: newName,
      status: "Stable"
    }

    setPatients([...patients, newPatient])
    setNewName("")
  }

  // เปลี่ยนสถานะ
  const toggleStatus = (id) => {
    const updated = patients.map(p =>
      p.id === id
        ? { ...p, status: p.status === "Critical" ? "Stable" : "Critical" }
        : p
    )

    setPatients(updated)
  }

  // ลบผู้ป่วย
  const deletePatient = (id) => {
    const filtered = patients.filter(p => p.id !== id)
    setPatients(filtered)
  }

  // สถิติ
  const total = patients.length
  const critical = patients.filter(p => p.status === "Critical").length
  const stable = patients.filter(p => p.status === "Stable").length

  // loading state
  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  // error state
  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Smart Care Dashboard
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Patients" value={total} />
        <StatCard title="Critical" value={critical} color="text-red-500" />
        <StatCard title="Stable" value={stable} color="text-green-500" />
      </div>

      {/* Search + Add */}
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Search patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <input
          type="text"
          placeholder="Enter new patient"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <button
          onClick={addPatient}
          className="bg-blue-500 text-white px-4 rounded-lg"
        >
          Add
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="font-semibold mb-4">Patient List</h2>

        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {patients
              .filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((p) => (
                <tr key={p.id} className="border-b">
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td
                    className={
                      p.status === "Critical"
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {p.status}
                  </td>

                  <td className="flex gap-2 py-2">
                    <button
                      onClick={() => toggleStatus(p.id)}
                      className="bg-yellow-400 px-2 rounded"
                    >
                      Toggle
                    </button>

                    <button
                      onClick={() => deletePatient(p.id)}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>

        </table>
      </div>

    </div>
  )
}