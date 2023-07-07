const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 6000;

app.use(cors());
app.use(bodyParser.json());

let tasks = [
  {
    id: 1,
    title: "Task 1",
    description: "This is task 1",
    dueDate: "2023-07-31",
    status: "Pending",
    assignedUser: "John Doe",
  },
  {
    id: 2,
    title: "Task 2",
    description: "This is task 2",
    dueDate: "2023-08-15",
    status: "Completed",
    assignedUser: "Jane Smith",
  },
];

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const task = req.body;
  task.id = tasks.length + 1;
  tasks.push(task);
  res.status(201).json(task);
});

app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const updatedTask = req.body;
  tasks = tasks.map((task) => (task.id == id ? updatedTask : task));
  res.json(updatedTask);
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((task) => task.id != id);
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
