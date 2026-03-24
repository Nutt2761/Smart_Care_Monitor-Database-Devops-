const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET ALL PATIENTS
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
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
        created_at,
        updated_at
      FROM patients
      ORDER BY id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("GET PATIENTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET PATIENT BY ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        id,
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
        created_at,
        updated_at
      FROM patients
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("GET PATIENT BY ID ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADD PATIENT
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

    const finalStatus = status || "stable";
    const allowedStatus = ["stable", "critical"];

    if (!allowedStatus.includes(finalStatus)) {
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
      `
      INSERT INTO patients
      (
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
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
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
        finalStatus,
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

// DELETE PATIENT
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query(
      "SELECT id FROM patients WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    await pool.query("DELETE FROM patients WHERE id = ?", [id]);

    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    console.error("DELETE PATIENT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;