import React, { useState } from 'react';
import axios from 'axios';

const Form = () => {
  const [formData, setFormData] = useState({
    Id: '',
    ParentId: '',
    NameElement: '',
    QuantityPerParent: '',
    Measure: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/Specification/Post', formData);
      alert('Specification created successfully');
      setFormData({
        Id: '',
        ParentId: '',
        NameElement: '',
        QuantityPerParent: '',
        Measure: ''
      });
    } catch (error) {
      console.error(error);
      alert('Failed to create specification');
    }
  };

  return (
    <div>
      <h2>Create Specification</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="Id" value={formData.Id} onChange={handleChange} placeholder="Id" /><br />
        <input type="text" name="ParentId" value={formData.ParentId} onChange={handleChange} placeholder="ParentId" /><br />
        <input type="text" name="NameElement" value={formData.NameElement} onChange={handleChange} placeholder="NameElement" /><br />
        <input type="text" name="QuantityPerParent" value={formData.QuantityPerParent} onChange={handleChange} placeholder="QuantityPerParent" /><br />
        <input type="text" name="Measure" value={formData.Measure} onChange={handleChange} placeholder="Measure" /><br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
