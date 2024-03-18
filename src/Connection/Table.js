import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Table = () => {
  const [specifications, setSpecifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/Specification/Get');
      setSpecifications(result.data);
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this specification?')) {
      try {
        await axios.delete(`/specifications/Delete/${id}`);
        alert('Specification deleted successfully');
        setSpecifications(specifications.filter(spec => spec.Id !== id));
      } catch (error) {
        console.error(error);
        alert('Failed to delete specification');
      }
    }
  };

  return (
    <div>
      <h2>Specifications</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Id</th>
            <th>ParentId</th>
            <th>NameElement</th>
            <th>QuantityPerParent</th>
            <th>Measure</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {specifications.map(spec => (
            <tr key={spec.Id}>
              <td>{spec.Id}</td>
              <td>{spec.ParentId}</td>
              <td>{spec.NameElement}</td>
              <td>{spec.QuantityPerParent}</td>
              <td>{spec.Measure}</td>
              <td>
                <button onClick={() => handleDelete(spec.Id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
