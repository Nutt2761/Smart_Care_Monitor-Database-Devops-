const express = require("express");
const router = express.Router();
const pool = require("../db"); // หรือ path ไฟล์ db ของหนู

// GET all notes / search by patientId
router.get("/", async (req, res) => {
  try {
    const { patientId } = req.query;

    let sql = `
      SELECT 
        id,
        patient_id AS patientId,
        type,
        content,
        author,
        role,
        created_at AS timestamp
      FROM medical_notes
    `;
    let params = [];

    if (patientId) {
      sql += ` WHERE patient_id LIKE ?`;
      params.push(`%${patientId}%`);
    }

    sql += ` ORDER BY created_at DESC`;

    const [rows] = await pool.query(sql, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error("GET /medical-notes error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET one note by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        id,
        patient_id AS patientId,
        type,
        content,
        author,
        role,
        created_at AS timestamp
      FROM medical_notes
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("GET /medical-notes/:id error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST create note
router.post("/", async (req, res) => {
  try {
    const { patientId, doctorName, content } = req.body;

    if (!patientId || !doctorName || !content) {
      return res.status(400).json({
        message: "patientId, doctorName and content are required",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO medical_notes (patient_id, type, content, author, role)
      VALUES (?, 'Doctor Comment', ?, ?, 'doctor')
      `,
      [patientId, content, doctorName]
    );

    const [rows] = await pool.query(
      `
      SELECT
        id,
        patient_id AS patientId,
        type,
        content,
        author,
        role,
        created_at AS timestamp
      FROM medical_notes
      WHERE id = ?
      `,
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("POST /medical-notes error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update content
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "content is required" });
    }

    const [result] = await pool.query(
      `
      UPDATE medical_notes
      SET content = ?
      WHERE id = ?
      `,
      [content, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    const [rows] = await pool.query(
      `
      SELECT
        id,
        patient_id AS patientId,
        type,
        content,
        author,
        role,
        created_at AS timestamp
      FROM medical_notes
      WHERE id = ?
      `,
      [id]
    );

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("PUT /medical-notes/:id error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE note
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `DELETE FROM medical_notes WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("DELETE /medical-notes/:id error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;