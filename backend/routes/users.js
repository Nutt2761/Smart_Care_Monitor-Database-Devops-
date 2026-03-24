const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");

const router = express.Router();


// GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, email, role, status, created_at, updated_at
      FROM users
      ORDER BY id DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// ADD USER
router.post("/", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required" });
    }

    const allowedRoles = ["admin", "doctor", "nurse", "patient"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `
      INSERT INTO users (email, password, role, status, created_at, updated_at)
      VALUES (?, ?, ?, 'active', NOW(), NOW())
      `,
      [email, hashedPassword, role]
    );

    const [newUser] = await pool.query(
      `
      SELECT id, email, role, status, created_at, updated_at
      FROM users
      WHERE id = ?
      `,
      [result.insertId]
    );

    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error("ADD USER ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// UPDATE USER
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: "Email and role are required" });
    }

    const allowedRoles = ["admin", "doctor", "nurse", "patient"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const [existingUser] = await pool.query(
      "SELECT id FROM users WHERE id = ?",
      [id]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const [duplicate] = await pool.query(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, id]
    );

    if (duplicate.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    await pool.query(
      `
      UPDATE users
      SET email = ?, role = ?, updated_at = NOW()
      WHERE id = ?
      `,
      [email, role, id]
    );

    const [updatedUser] = await pool.query(
      `
      SELECT id, email, role, status, created_at, updated_at
      FROM users
      WHERE id = ?
      `,
      [id]
    );

    res.json(updatedUser[0]);
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// TOGGLE STATUS
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["active", "inactive"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const [existingUser] = await pool.query(
      "SELECT id FROM users WHERE id = ?",
      [id]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    await pool.query(
      `
      UPDATE users
      SET status = ?, updated_at = NOW()
      WHERE id = ?
      `,
      [status, id]
    );

    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("PATCH STATUS ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// DELETE USER
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [existingUser] = await pool.query(
      "SELECT id FROM users WHERE id = ?",
      [id]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    await pool.query("DELETE FROM users WHERE id = ?", [id]);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;