const API_URL = "http://localhost:3000/api/students";
const tableBody = document.getElementById("Student_Table");
const form = document.getElementById("studentform");
const searchbox = document.getElementById("searchbox");

async function loadStudents(query = "") {
  const res = await fetch(`${API_URL}?q=${query}`);
  const students = await res.json();
  tableBody.innerHTML = students.map((s, i) => `
  <tr>
    <td>${i + 1}</td>
    <td>${s.name}</td>
    <td>${s.age}</td>
    <td>${s.phone}</td>
    <td>${s.email}</td>
    <td>${s.department}</td>
    <td>${s.place}</td>
    <td>
      <button class="btn btn-warning btn-sm" onclick="editStudent('${s._id}')">✏️ Edit</button>
      <button class="btn btn-danger btn-sm" onclick="deleteStudent('${s._id}')">🗑️ Delete</button>
    </td>
  </tr>
`).join("") };

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("studentId").value;
  const data = {
    sino: document.getElementById("sino").value,
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    department: document.getElementById("department").value,
    place: document.getElementById("place").value,
  };

  if (id) {
    await fetch(`${API_URL}/${id}`, { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify(data) });
  } else {
    await fetch(API_URL, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(data) });
  }

  form.reset();
  document.getElementById("studentId").value = "";
  bootstrap.Modal.getInstance(document.getElementById("Sadd")).hide();
  loadStudents();
});

async function editStudent(id) {
  const res = await fetch(`${API_URL}`);
  const students = await res.json();
  const s = students.find(x => x._id === id);

  document.getElementById("studentId").value = s._id;
  document.getElementById("sino").value = s.sino;
  document.getElementById("name").value = s.name;
  document.getElementById("age").value = s.age;
  document.getElementById("phone").value = s.phone;
  document.getElementById("email").value = s.email;
  document.getElementById("department").value = s.department;
  document.getElementById("place").value = s.place;
  new bootstrap.Modal(document.getElementById("Sadd")).show();
}

async function deleteStudent(id) {
  if (confirm("Are you sure you want to delete this student?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadStudents();
  }
}
searchbox.addEventListener("input", (e) => loadStudents(e.target.value));

loadStudents();
