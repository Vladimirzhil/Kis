import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Button, Input } from 'semantic-ui-react';
import Modal from 'react-modal';

export default function ReadSpecification() {
    const [APIData, setAPIData] = useState([]);
    const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        Id: '',
        ParentId: '',
        Description: '',
        QuantityPerParent: '',
        Measure: ''
    });

    useEffect(() => {
        getData();
    }, []);

    const setData = (data) => {
        localStorage.setItem('Id', data.Id);
        localStorage.setItem('ParentId', data.ParentId);
        localStorage.setItem('Description', data.Description);
        localStorage.setItem('QuantityPerParent', data.Description);
        localStorage.setItem('Measure', data.Measure);
    };

    const getData = () => {
        axios.get('http://localhost:3001/api/specifications/Get')
            .then((response) => {
                setAPIData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    const onDelete = (id) => {
        axios.delete(`http://localhost:3001/api/specifications/Delete/${id}`)
            .then(() => {
                getData();
            })
            .catch((error) => {
                console.error('Error deleting item:', error);
            });
    };

    const onUpdate = () => {
        axios.put(`http://localhost:3001/api/specifications/Put/${formData.Id}`, formData)
            .then(() => {
                closeUpdateModal();
                getData();
            })
            .catch((error) => {
                console.error('Error updating item:', error);
            });
    };

    const onCreate = () => {
        axios.post('http://localhost:3001/api/specifications/Post', formData)
            .then(() => {
                closeCreateModal();
                getData();
            })
            .catch((error) => {
                console.error('Error creating item:', error);
            });
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const openUpdateModal = (data) => {
        setFormData(data);
        setUpdateModalIsOpen(true);
    };

    const closeUpdateModal = () => {
        setUpdateModalIsOpen(false);
    };

    const openCreateModal = () => {
        setFormData({
            Id: '',
            ParentId: '',
            Description: '',
            QuantityPerParent: '',
            Measure: ''
        });
        setCreateModalIsOpen(true);
    };

    const closeCreateModal = () => {
        setCreateModalIsOpen(false);
    };

    return (
        <div>
            <Table singleLine>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ParentId</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>QuantityPerParent</Table.HeaderCell>
                        <Table.HeaderCell>Measure</Table.HeaderCell>
                        <Table.HeaderCell>Update</Table.HeaderCell>
                        <Table.HeaderCell>Delete</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {APIData.map((data) => (
                        <Table.Row key={data.Id}>
                            <Table.Cell>{data.ParentId}</Table.Cell>
                            <Table.Cell>{data.Description}</Table.Cell>
                            <Table.Cell>{data.QuantityPerParent}</Table.Cell>
                            <Table.Cell>{data.Measure}</Table.Cell>
                            <Table.Cell>
                                <Button className="control-button" onClick={() => openUpdateModal(data)}>Обновить</Button>
                            </Table.Cell>
                            <Table.Cell>
                                <Button className="control-button" onClick={() => onDelete(data.Id)}>Удалить</Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <Button className="control-button" onClick={openCreateModal}>Добавить</Button>
            <Modal isOpen={updateModalIsOpen} onRequestClose={closeUpdateModal}>
                <h2>Update Data</h2>
                <Input 
                    label="ParentId" 
                    name="ParentId" 
                    value={formData.ParentId} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Description" 
                    name="Description" 
                    value={formData.Description} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="QuantityPerParent" 
                    name="QuantityPerParent" 
                    value={formData.QuantityPerParent} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Measure" 
                    name="Measure" 
                    value={formData.Measure} 
                    onChange={handleInputChange} 
                />
                <div style={{ marginTop: '10px' }}>
                    <Button className="control-button" onClick={onUpdate}>Сохранить</Button>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <Button className="control-button" onClick={closeUpdateModal}>Отменить</Button>
                </div>
            </Modal>
            <Modal isOpen={createModalIsOpen} onRequestClose={closeCreateModal}>
                <h2>Create Data</h2>
                <Input 
                    label="ParentId" 
                    name="ParentId" 
                    value={formData.ParentId} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Description" 
                    name="Description" 
                    value={formData.Description} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="QuantityPerParent" 
                    name="QuantityPerParent" 
                    value={formData.QuantityPerParent} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Measure" 
                    name="Measure" 
                    value={formData.Measure} 
                    onChange={handleInputChange} 
                />
                <div style={{ marginTop: '10px' }}>
                    <Button className="control-button" onClick={onCreate}>Сохранить</Button>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <Button className="control-button" onClick={closeCreateModal}>Отменить</Button>
                </div>
            </Modal>
        </div>
    );
}