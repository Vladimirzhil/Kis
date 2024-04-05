import React, { useState } from 'react';
import axios from 'axios';

const Stock = () => {
    const [formData, setFormData] = useState({
        SpecificationId: '',
        Receivedquantity: '',
        Shippedquantity: '',
        Dateoperation: ''
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePost = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/stocks/Post', formData);
            setSuccessMessage(response.data.message);
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const handleGet = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/stocks/Get/${formData.SpecificationId}?Dateoperation=${formData.Dateoperation}`);
            console.log(response.data);
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const handlePut = async () => {
        try {
            const response = await axios.put(`http://localhost:3001/api/stocks/Put/${formData.SpecificationId}`, formData);
            setSuccessMessage(response.data.message);
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:3001/api/stocks/Delete/${formData.SpecificationId}`);
            setSuccessMessage(response.data.message);
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    return (
        <div>
            <h1>Stock Form</h1>
            <form onSubmit={(e) => { e.preventDefault(); handlePost(); }}>
                <input
                    type="text"
                    name="SpecificationId"
                    value={formData.SpecificationId}
                    onChange={handleChange}
                    placeholder="Specification ID"
                />
                <input
                    type="text"
                    name="Receivedquantity"
                    value={formData.Receivedquantity}
                    onChange={handleChange}
                    placeholder="Received Quantity"
                />
                <input
                    type="text"
                    name="Shippedquantity"
                    value={formData.Shippedquantity}
                    onChange={handleChange}
                    placeholder="Shipped Quantity"
                />
                <input
                    type="text"
                    name="Dateoperation"
                    value={formData.Dateoperation}
                    onChange={handleChange}
                    placeholder="Date of Operation"
                />
                <button type="submit">Create</button>
            </form>
            <form onSubmit={(e) => { e.preventDefault(); handleGet(); }}>
                <input
                    type="text"
                    name="SpecificationId"
                    value={formData.SpecificationId}
                    onChange={handleChange}
                    placeholder="Specification ID"
                />
                <input
                    type="text"
                    name="Dateoperation"
                    value={formData.Dateoperation}
                    onChange={handleChange}
                    placeholder="Date of Operation"
                />
                <button type="submit">Read</button>
            </form>
            <form onSubmit={(e) => { e.preventDefault(); handlePut(); }}>
                <input
                    type="text"
                    name="SpecificationId"
                    value={formData.SpecificationId}
                    onChange={handleChange}
                    placeholder="Specification ID"
                />
                <input
                    type="text"
                    name="Receivedquantity"
                    value={formData.Receivedquantity}
                    onChange={handleChange}
                    placeholder="Received Quantity"
                />
                <input
                    type="text"
                    name="Shippedquantity"
                    value={formData.Shippedquantity}
                    onChange={handleChange}
                    placeholder="Shipped Quantity"
                />
                <input
                    type="text"
                    name="Dateoperation"
                    value={formData.Dateoperation}
                    onChange={handleChange}
                    placeholder="Date of Operation"
                />
                <button type="submit">Update</button>
            </form>
            <form onSubmit={(e) => { e.preventDefault(); handleDelete(); }}>
                <input
                    type="text"
                    name="SpecificationId"
                    value={formData.SpecificationId}
                    onChange={handleChange}
                    placeholder="Specification ID"
                />
                <button type="submit">Delete</button>
            </form>
            {error && <p>{error}</p>}
            {successMessage && <p>{successMessage}</p>}
        </div>
    );
};

export default Stock;
