const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 5000;

mongoose
  .connect("mongodb://localhost:27017/employee", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error(error.message));

const schema = new mongoose.Schema({
  Name: { type: String, required: true },
  Role: { type: String, required: true },
  Salary: { type: String, required: true },
  Department: { type: String, required: true },
});

const Data = mongoose.model("employee", schema);

app.use(cors());
app.use(bodyparser.json());


app.get("/employee", async (req, res) => {
  try {
    const employee = await Data.find();
    res.json({ employee });
    console.log(employee);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

app.post("/employeepost", async (req, res) => {
  console.log("Connected to POST");
  try {
    const employee = new Data(req.body);
    await employee.save();
    res.json({ employee });
    console.log(employee);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

app.put("/employeeupdate/:id", async (req, res) => {
  try {
    const employee = await Data.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ employee });
    console.log(employee);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

app.delete("/employeedelete/:id", async (req, res) => {
  try {
    const employee = await Data.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted", employee });
    console.log(employee);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server is running successfully on port ${port}`);
});
