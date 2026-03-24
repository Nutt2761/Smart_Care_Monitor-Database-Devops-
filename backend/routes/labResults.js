const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET lab results
router.get("/", async (req, res) => {
  try {
    const { role, userId } = req.query;

    let sql = `
      SELECT 
        lr.id,
        lr.patient_id,
        p.patient_code,
        lr.doctor_id,
        lr.test_type,
        lr.test_result,
        lr.nurse_note,
        lr.created_at,
        lr.updated_at
      FROM lab_results lr
      LEFT JOIN patients p ON lr.patient_id = p.id
    `;

    const params = [];

    if (role === "patient" && userId) {
      sql += ` WHERE lr.patient_id = ?`;
      params.push(Number(userId));
    } else if (role === "doctor" && userId) {
      sql += ` WHERE lr.doctor_id = ?`;
      params.push(Number(userId));
    }

    sql += ` ORDER BY lr.created_at DESC`;

    const [rows] = await pool.query(sql, params);
    res.status(200).json(rows);
  } catch (err) {
    console.error("GET lab results error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// POST create lab result using patient_code เช่น P002
router.post("/", async (req, res) => {
  try {
    const { patient_code, doctor_id, test_type, test_result, nurse_note } = req.body;

    if (!patient_code || !doctor_id || !test_type || !test_result) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const normalizedPatientCode = String(patient_code).trim().toUpperCase();
    const normalizedDoctorId = Number(doctor_id);
    const normalizedTestType = String(test_type).trim();
    const normalizedTestResult = String(test_result).trim();
    const normalizedNurseNote = nurse_note ? String(nurse_note).trim() : "";

    if (!normalizedPatientCode || !normalizedDoctorId || !normalizedTestType || !normalizedTestResult) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // หา patient จาก patient_code
    const [patients] = await pool.query(
      `SELECT id, patient_code FROM patients WHERE patient_code = ? LIMIT 1`,
      [normalizedPatientCode]
    );

    if (patients.length === 0) {
      return res.status(404).json({ message: "Patient code not found" });
    }

    const patient_id = patients[0].id;

    const [result] = await pool.query(
      `
      INSERT INTO lab_results
      (patient_id, doctor_id, test_type, test_result, nurse_note)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        patient_id,
        normalizedDoctorId,
        normalizedTestType,
        normalizedTestResult,
        normalizedNurseNote,
      ]
    );

    const [rows] = await pool.query(
      `
      SELECT 
        lr.id,
        lr.patient_id,
        p.patient_code,
        lr.doctor_id,
        lr.test_type,
        lr.test_result,
        lr.nurse_note,
        lr.created_at,
        lr.updated_at
      FROM lab_results lr
      LEFT JOIN patients p ON lr.patient_id = p.id
      WHERE lr.id = ?
      `,
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST lab result error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// PUT update full lab result
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_code, doctor_id, test_type, test_result, nurse_note } = req.body;

    if (!patient_code || !doctor_id || !test_type || !test_result) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const normalizedPatientCode = String(patient_code).trim().toUpperCase();
    const normalizedDoctorId = Number(doctor_id);
    const normalizedTestType = String(test_type).trim();
    const normalizedTestResult = String(test_result).trim();
    const normalizedNurseNote = nurse_note ? String(nurse_note).trim() : "";

    if (!normalizedPatientCode || !normalizedDoctorId || !normalizedTestType || !normalizedTestResult) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const [patients] = await pool.query(
      `SELECT id, patient_code FROM patients WHERE patient_code = ? LIMIT 1`,
      [normalizedPatientCode]
    );

    if (patients.length === 0) {
      return res.status(404).json({ message: "Patient code not found" });
    }

    const patient_id = patients[0].id;

    const [updateResult] = await pool.query(
      `
      UPDATE lab_results
      SET
        patient_id = ?,
        doctor_id = ?,
        test_type = ?,
        test_result = ?,
        nurse_note = ?
      WHERE id = ?
      `,
      [
        patient_id,
        normalizedDoctorId,
        normalizedTestType,
        normalizedTestResult,
        normalizedNurseNote,
        id,
      ]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "Lab result not found" });
    }

    const [rows] = await pool.query(
      `
      SELECT 
        lr.id,
        lr.patient_id,
        p.patient_code,
        lr.doctor_id,
        lr.test_type,
        lr.test_result,
        lr.nurse_note,
        lr.created_at,
        lr.updated_at
      FROM lab_results lr
      LEFT JOIN patients p ON lr.patient_id = p.id
      WHERE lr.id = ?
      `,
      [id]
    );

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("PUT lab result error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// PUT nurse update
router.put("/:id/nurse-note", async (req, res) => {
  try {
    const { id } = req.params;
    const { nurse_note } = req.body;

    if (!nurse_note || !String(nurse_note).trim()) {
      return res.status(400).json({ message: "nurse_note required" });
    }

    const [updateResult] = await pool.query(
      `
      UPDATE lab_results
      SET nurse_note = ?
      WHERE id = ?
      `,
      [String(nurse_note).trim(), id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "Lab result not found" });
    }

    const [rows] = await pool.query(
      `
      SELECT 
        lr.id,
        lr.patient_id,
        p.patient_code,
        lr.doctor_id,
        lr.test_type,
        lr.test_result,
        lr.nurse_note,
        lr.created_at,
        lr.updated_at
      FROM lab_results lr
      LEFT JOIN patients p ON lr.patient_id = p.id
      WHERE lr.id = ?
      `,
      [id]
    );

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("PUT nurse note error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

module.exports = router;