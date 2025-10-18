const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public")); 

mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
  .then(() => console.log("✅ MongoDB Connected successfully "))
  .catch(err => console.error("❌ MongoDB connection failed", err));

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  phone: String,
  email: String,
  department: String,
  place: String
});

const Student = mongoose.model("Student", studentSchema);

app.get("/api/students", async (req, res) => {
  const q = req.query.q || "";
  const students = await Student.find({
    name: { $regex: q, $options: "i" }
  });
  res.json(students);
});

app.post("/api/students", async (req, res) => {
  const newStudent = new Student(req.body);
  await newStudent.save();
  res.json(newStudent);
});

app.put("/api/students/:id", async (req, res) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete("/api/students/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));
