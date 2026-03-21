const express = require("express");
const pool = require("../db");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      patient_code,
      full_name,
      birth_date,
      weight,
      height,
      blood_type,
      chronic_disease,
      allergy,
      emergency_contact,
      status,
    } = req.body;

    if (!user_id || !patient_code || !full_name || !birth_date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const allowedStatus = ["stable", "critical"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const [existing] = await pool.query(
      "SELECT id FROM patients WHERE patient_code = ?",
      [patient_code]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Patient code already exists" });
    }

    const [result] = await pool.query(
      `INSERT INTO patients
      (user_id, patient_code, full_name, birth_date, weight, height, blood_type, chronic_disease, allergy, emergency_contact, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        user_id,
        patient_code,
        full_name,
        birth_date,
        weight || null,
        height || null,
        blood_type || null,
        chronic_disease || null,
        allergy || null,
        emergency_contact || null,
        status,
      ]
    );

    const [rows] = await pool.query(
      "SELECT * FROM patients WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("ADD PATIENT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;