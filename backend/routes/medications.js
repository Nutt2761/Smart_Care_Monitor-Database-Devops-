const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET medications
router.get("/", async (req, res) => {
  try {
    const { role, email } = req.query;

    let sql = `
      SELECT 
        m.id,
        p.id AS patient,
        d.email AS doctor,
        DATE_FORMAT(m.created_at, '%Y-%m-%d') AS date,
        m.medicine_name AS medicine,
        m.medicine_type AS type,
        m.\`usage\` AS usage_text,
        m.nurse_note AS nurseNote
      FROM medications m
      JOIN patients p ON m.patient_id = p.id
      JOIN users d ON m.doctor_id = d.id
    `;

    const params = [];

    if (role === "doctor") {
      sql += ` WHERE d.email = ? `;
      params.push(email);
    }

    sql += ` ORDER BY m.created_at DESC`;

    const [rows] = await pool.query(sql, params);

    const formattedRows = rows.map((row) => ({
      ...row,
      usage: row.usage_text,
    }));

    res.json(formattedRows);
  } catch (error) {
    console.error("GET /api/medications error:", error);
    res.status(500).json({ message: "Failed to fetch medications" });
  }
});

// POST create medication
router.post("/", async (req, res) => {
  try {
    const { patientId, doctorEmail, medicine, type, usage } = req.body;

    console.log("REQ BODY:", req.body);

    if (!patientId || !doctorEmail || !medicine || !type || !usage) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const [patientRows] = await pool.query(
      `SELECT id FROM patients WHERE id = ? LIMIT 1`,
      [patientId]
    );

    if (patientRows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const [doctorRows] = await pool.query(
      `SELECT id, email FROM users WHERE email = ? LIMIT 1`,
      [doctorEmail]
    );

    if (doctorRows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const [result] = await pool.query(
      `
      INSERT INTO medications
      (patient_id, doctor_id, medicine_name, medicine_type, \`usage\`, nurse_note)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [patientRows[0].id, doctorRows[0].id, medicine, type, usage, null]
    );

    const [newRows] = await pool.query(
      `
      SELECT 
        m.id,
        p.id AS patient,
        d.email AS doctor,
        DATE_FORMAT(m.created_at, '%Y-%m-%d') AS date,
        m.medicine_name AS medicine,
        m.medicine_type AS type,
        m.\`usage\` AS usage_text,
        m.nurse_note AS nurseNote
      FROM medications m
      JOIN patients p ON m.patient_id = p.id
      JOIN users d ON m.doctor_id = d.id
      WHERE m.id = ?
      `,
      [result.insertId]
    );

    const row = {
      ...newRows[0],
      usage: newRows[0].usage_text,
    };

    res.status(201).json(row);
  } catch (error) {
    console.error("POST /api/medications error:", error);
    res.status(500).json({ message: "Failed to create medication record" });
  }
});

// PUT update nurse note
router.put("/:id/nurse-note", async (req, res) => {
  try {
    const { id } = req.params;
    const { nurseNote } = req.body;

    if (!nurseNote) {
      return res.status(400).json({ message: "nurseNote is required" });
    }

    const [result] = await pool.query(
      `
      UPDATE medications
      SET nurse_note = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [nurseNote, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Medication record not found" });
    }

    res.json({ message: "Nurse note updated successfully" });
  } catch (error) {
    console.error("PUT /api/medications/:id/nurse-note error:", error);
    res.status(500).json({ message: "Failed to update nurse note" });
  }
});

module.exports = router;