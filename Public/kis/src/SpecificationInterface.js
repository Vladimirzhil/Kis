import React, { useState } from 'react';
import axios from 'axios';

function SpecificationInterface() {
    const [parentId, setParentId] = useState('');
    const [description, setDescription] = useState('');
    const [quantityPerParent, setQuantityPerParent] = useState('');
    const [measure, setMeasure] = useState('');
    const [idToUpdate, setIdToUpdate] = useState('');
    const [idToDelete, setIdToDelete] = useState('');

    const handleGetAll = () => {
        axios.get('http://localhost:3001/api/specifications/Get')
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleCreate = () => {
        const requestData = {
            ParentId: parentId !== '' ? parseInt(parentId) : null,
            Description: description,
            QuantityPerParent: parseInt(quantityPerParent),
            Measure: measure
        };

        axios.post('http://localhost:3001/api/specifications/Post', requestData)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    };

    const handleUpdate = () => {
        const requestData = {
            ParentId: parseInt(parentId),
            Description: description,
            QuantityPerParent: parseInt(quantityPerParent),
            Measure: parseInt(measure)
        };

        axios.put(`http://localhost:3001/api/specifications/Put/${idToUpdate}`, requestData)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    };

    const handleDelete = () => {
        axios.delete(`http://localhost:3001/api/specifications/Delete/${idToDelete}`)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    };

    return (
        <div>
            <h1>Specification Interface</h1>

            <button onClick={handleGetAll}>Get All Specifications</button><br/>

            <input type="text" placeholder="Parent Id" value={parentId} onChange={e => setParentId(e.target.value)} /><br/>
            <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} /><br/>
            <input type="text" placeholder="Quantity Per Parent" value={quantityPerParent} onChange={e => setQuantityPerParent(e.target.value)} /><br/>
            <input type="text" placeholder="Measure" value={measure} onChange={e => setMeasure(e.target.value)} /><br/>
            <button onClick={handleCreate}>Create Specification</button><br/>

            <input type="text" placeholder="ID to Update" value={idToUpdate} onChange={e => setIdToUpdate(e.target.value)} /><br/>
            <button onClick={handleUpdate}>Update Specification</button><br/>

            <input type="text" placeholder="ID to Delete" value={idToDelete} onChange={e => setIdToDelete(e.target.value)} /><br/>
            <button onClick={handleDelete}>Delete Specification</button>
        </div>
    );
}

export default SpecificationInterface;
