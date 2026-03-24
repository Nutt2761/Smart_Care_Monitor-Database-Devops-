const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET vitals by patient id (latest first)
router.get("/patient/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    const [rows] = await pool.query(
      `
      SELECT id, patient_id, heart_rate, systolic, diastolic, respiration,
             temperature, spo2, recorded_at, created_at
      FROM vital_signs
      WHERE patient_id = ?
      ORDER BY recorded_at DESC, id DESC
      `,
      [patientId]
    );

    res.json(rows);
  } catch (err) {
    console.error("GET VITALS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADD vital sign
router.post("/", async (req, res) => {
  try {
    const {
      patient_id,
      heart_rate,
      systolic,
      diastolic,
      respiration,
      temperature,
      spo2,
      recorded_at,
    } = req.body;

    if (!patient_id || !recorded_at) {
      return res.status(400).json({
        message: "patient_id and recorded_at are required",
      });
    }

    const [patient] = await pool.query(
      "SELECT id FROM patients WHERE id = ?",
      [patient_id]
    );

    if (patient.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const [result] = await pool.query(
      `
      INSERT INTO vital_signs
      (
        patient_id,
        heart_rate,
        systolic,
        diastolic,
        respiration,
        temperature,
        spo2,
        recorded_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        patient_id,
        heart_rate || null,
        systolic || null,
        diastolic || null,
        respiration || null,
        temperature || null,
        spo2 || null,
        recorded_at,
      ]
    );

    const [rows] = await pool.query(
      `
      SELECT id, patient_id, heart_rate, systolic, diastolic, respiration,
             temperature, spo2, recorded_at, created_at
      FROM vital_signs
      WHERE id = ?
      `,
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("ADD VITAL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;