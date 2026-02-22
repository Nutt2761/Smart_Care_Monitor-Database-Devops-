export default function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <h2 className="text-gray-500 text-sm">{title}</h2>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}