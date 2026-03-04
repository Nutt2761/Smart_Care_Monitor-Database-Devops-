import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔐 mock users (ไม่มี backend)
  const users = [
    {
      email: "admin@mail.com",
      password: "admin123",
      role: "admin",
    },
    {
      email: "doctor@mail.com",
      password: "doctor123",
      role: "doctor",
    },
  ];

  const handleLogin = () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    const foundUser = users.find(
      (user) =>
        user.email === trimmedEmail &&
        user.password === trimmedPassword
    );

    if (foundUser) {
      localStorage.setItem("role", foundUser.role);
      localStorage.setItem("email", foundUser.email);
      navigate("/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4">
        <h1 className="text-2xl font-bold text-center">
          Smart Care Login
        </h1>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Login
        </button>

        <div className="text-sm text-gray-500 mt-4">
          <p>Admin: admin@mail.com / admin123</p>
          <p>Doctor: doctor@mail.com / doctor123</p>
        </div>
      </div>
    </div>
  );
}