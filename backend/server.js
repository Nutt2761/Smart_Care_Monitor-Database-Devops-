const express = require("express");
const cors = require("cors");
require("dotenv").config();

const usersRoutes = require("./routes/users");
const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).send("OK from root");
});

app.use("/api/users", usersRoutes);

const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);

const patientsRoutes = require("./routes/patients");
app.use("/api/patients", patientsRoutes);

const vitalsRoutes = require("./routes/vitals");
app.use("/api/vitals", vitalsRoutes);

const medicalNotesRoutes = require("./routes/medicalNotes");
app.use("/api/medical-notes", medicalNotesRoutes);

const labResultsRoutes = require("./routes/labResults");
app.use("/api/lab-results", labResultsRoutes);

const medicationsRoutes = require("./routes/medications");
app.use("/api/medications", medicationsRoutes);

const appointmentsRoutes = require("./routes/appointments");
app.use("/api/appointments", appointmentsRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});