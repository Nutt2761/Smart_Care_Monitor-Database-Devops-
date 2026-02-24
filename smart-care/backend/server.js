const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "smartcare"
});

// GET all patients
app.get("/patients", (req, res) => {
  db.query("SELECT * FROM patients", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// POST new patient
app.post("/patients", (req, res) => {
  const { name, age } = req.body;
  db.query(
    "INSERT INTO patients (name, age) VALUES (?, ?)",
    [name, age],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ id: result.insertId, name, age });
    }
  );
});

// DELETE
app.delete("/patients/:id", (req, res) => {
  db.query("DELETE FROM patients WHERE id = ?", [req.params.id]);
  res.send("Deleted");
});

// UPDATE
app.put("/patients/:id", (req, res) => {
  const { name, age } = req.body;
  db.query(
    "UPDATE patients SET name=?, age=? WHERE id=?",
    [name, age, req.params.id]
  );
  res.send("Updated");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});