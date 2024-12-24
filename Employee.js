import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Employee.css';

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [department, setDepartment] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading,setLoading]=useState(true);
  const [id, setId] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/employee');
        console.log("Response:", response.data)
        setEmployees(response.data.employees || []);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false)
      }
    };
    fetchEmployees();
  }, []);

  if(loading) {
    return <div>Loading...</div>
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        const response = await axios.put(`http://localhost:5000/employeeupdate/${id}`, {
        Name:name,
        Role:role,
        Salary:salary,
        Department:department,
      });
        setEmployees(employees.map((emp) => (emp._id === id ? response.data.employee : emp)));
      }
       else {
        const response = await axios.post('http://localhost:5000/employeepost', {
        Name:name,
        Role:role,
        Salary:salary,
        Department:department,

      });
        setEmployees([...employees, response.data.employee]);
      }
      resetForm();
    } catch (error) {
      console.error(editing ? 'Error updating employee:' : 'Error adding employee:', error);
    }
  };

  const handleEdit = (employee) => {
    setEditing(true);
    setId(employee._id);
    setName(employee.Name);
    setRole(employee.Role);
    setSalary(employee.Salary);
    setDepartment(employee.Department);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/employeedelete/${id}`);
      setEmployees(employees.filter((emp) => emp._id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const resetForm = () => {
    setEditing(false);
    setId('');
    setName('');
    setRole('');
    setSalary('');
    setDepartment('');
  };

  return (
    <div className="App">
      <fieldset>
        <h1><i><b>Employee Management System</b></i></h1>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
          <br />
          <br />
          <label>Role:</label>
          <input type="text" value={role} onChange={(event) => setRole(event.target.value)} />
          <br />
          <br />
          <label>Salary:</label>
          <input type="number" value={salary} onChange={(event) => setSalary(event.target.value)} />
          <br />
          <label>Department:</label>
          <input type="text" value={department} onChange={(event) => setDepartment(event.target.value)} />
          <br />
          <br />
          <br />
          <button type="submit">{editing ? 'Update' : 'Add'}</button>
        </form>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Salary</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(employees) && employees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.Name}</td>
                <td>{employee.Role}</td>
                <td>{employee.Salary}</td>
                <td>{employee.Department}</td>
                <td>
                  <button onClick={() => handleEdit(employee)}>Edit</button>
                  <button onClick={() => handleDelete(employee._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </fieldset>
    </div>
  );
};

export default App;
