const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET appointments
router.get("/", async (req, res) => {
  try {
    const { role, userId } = req.query;

    let sql = `
      SELECT
        a.id,
        a.patient_id,
        a.doctor_id,
        a.date,
        a.time,
        a.reason,
        a.created_at,
        a.updated_at
      FROM appointments a
    `;

    const params = [];

    if (role === "patient" && userId) {
      sql += ` WHERE a.patient_id = ?`;
      params.push(Number(userId));
    } else if (role === "doctor" && userId) {
      sql += ` WHERE a.doctor_id = ?`;
      params.push(Number(userId));
    }

    sql += ` ORDER BY a.date ASC, a.time ASC`;

    const [rows] = await pool.query(sql, params);
    res.status(200).json(rows);
  } catch (err) {
    console.error("GET appointments error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// GET one appointment
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        id,
        patient_id,
        doctor_id,
        date,
        time,
        reason,
        created_at,
        updated_at
      FROM appointments
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("GET appointment by id error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// CREATE appointment
router.post("/", async (req, res) => {
  try {
    const { patient_id, doctor_id, date, time, reason } = req.body;

    if (!patient_id || !doctor_id || !date || !time || !reason) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const normalizedPatientId = Number(patient_id);
    const normalizedDoctorId = Number(doctor_id);
    const normalizedReason = String(reason).trim();

    if (!normalizedPatientId || !normalizedDoctorId || !normalizedReason) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const [patientRows] = await pool.query(
      `SELECT id FROM patients WHERE id = ? LIMIT 1`,
      [normalizedPatientId]
    );

    if (patientRows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const [doctorRows] = await pool.query(
      `SELECT id FROM users WHERE id = ? LIMIT 1`,
      [normalizedDoctorId]
    );

    if (doctorRows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const [result] = await pool.query(
      `
      INSERT INTO appointments
      (patient_id, doctor_id, date, time, reason)
      VALUES (?, ?, ?, ?, ?)
      `,
      [normalizedPatientId, normalizedDoctorId, date, time, normalizedReason]
    );

    const [rows] = await pool.query(
      `
      SELECT
        id,
        patient_id,
        doctor_id,
        date,
        time,
        reason,
        created_at,
        updated_at
      FROM appointments
      WHERE id = ?
      `,
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST appointment error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// UPDATE appointment
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_id, doctor_id, date, time, reason } = req.body;

    if (!patient_id || !doctor_id || !date || !time || !reason) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const normalizedPatientId = Number(patient_id);
    const normalizedDoctorId = Number(doctor_id);
    const normalizedReason = String(reason).trim();

    if (!normalizedPatientId || !normalizedDoctorId || !normalizedReason) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const [patientRows] = await pool.query(
      `SELECT id FROM patients WHERE id = ? LIMIT 1`,
      [normalizedPatientId]
    );

    if (patientRows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const [doctorRows] = await pool.query(
      `SELECT id FROM users WHERE id = ? LIMIT 1`,
      [normalizedDoctorId]
    );

    if (doctorRows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const [updateResult] = await pool.query(
      `
      UPDATE appointments
      SET
        patient_id = ?,
        doctor_id = ?,
        date = ?,
        time = ?,
        reason = ?
      WHERE id = ?
      `,
      [normalizedPatientId, normalizedDoctorId, date, time, normalizedReason, id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const [rows] = await pool.query(
      `
      SELECT
        id,
        patient_id,
        doctor_id,
        date,
        time,
        reason,
        created_at,
        updated_at
      FROM appointments
      WHERE id = ?
      `,
      [id]
    );

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("PUT appointment error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// DELETE appointment
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [deleteResult] = await pool.query(
      `DELETE FROM appointments WHERE id = ?`,
      [id]
    );

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("DELETE appointment error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

module.exports = router;