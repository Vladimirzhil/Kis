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
        SpecificationId: '',
        Receivedquantity: '',
        Shippedquantity: '',
        Dateoperation: ''
    });

    useEffect(() => {
        getData();
    }, []);

    const setData = (data) => {
        localStorage.setItem('Id', data.Id);
        localStorage.setItem('SpecificationId', data.SpecificationId);
        localStorage.setItem('Receivedquantity', data.Receivedquantity);
        localStorage.setItem('Shippedquantity', data.Shippedquantity);
        localStorage.setItem('Dateoperation', data.Dateoperation);
    };

    const getData = () => {
        axios.get('http://localhost:3001/api/stocks/Get')
            .then((response) => {
                setAPIData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    const onDelete = (id) => {
        axios.delete(`http://localhost:3001/api/stocks/Delete/${id}`)
            .then(() => {
                getData();
            })
            .catch((error) => {
                console.error('Error deleting item:', error);
            });
    };

    const onUpdate = () => {
        axios.put(`http://localhost:3001/api/stocks/Put/${formData.Id}`, formData)
            .then(() => {
                closeUpdateModal();
                getData();
            })
            .catch((error) => {
                console.error('Error updating item:', error);
            });
    };

    const onCreate = () => {
        axios.post('http://localhost:3001/api/stocks/Post', formData)
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
            SpecificationId: '',
            Receivedquantity: '',
            Shippedquantity: '',
            Dateoperation: ''
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
                        <Table.HeaderCell>SpecificationId</Table.HeaderCell>
                        <Table.HeaderCell>Receivedquantity</Table.HeaderCell>
                        <Table.HeaderCell>Shippedquantity</Table.HeaderCell>
                        <Table.HeaderCell>Dateoperation</Table.HeaderCell>
                        <Table.HeaderCell>Update</Table.HeaderCell>
                        <Table.HeaderCell>Delete</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {APIData.map((data) => (
                        <Table.Row key={data.Id}>
                            <Table.Cell>{data.SpecificationId}</Table.Cell>
                            <Table.Cell>{data.Receivedquantity}</Table.Cell>
                            <Table.Cell>{data.Shippedquantity}</Table.Cell>
                            <Table.Cell>{data.Dateoperation}</Table.Cell>
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
                    label="SpecificationId" 
                    name="SpecificationId" 
                    value={formData.SpecificationId} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Receivedquantity" 
                    name="Receivedquantity" 
                    value={formData.Receivedquantity} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Shippedquantity" 
                    name="Shippedquantity" 
                    value={formData.Shippedquantity} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Dateoperation" 
                    name="Dateoperation" 
                    value={formData.Dateoperation} 
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
                    label="SpecificationId" 
                    name="SpecificationId" 
                    value={formData.SpecificationId} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Receivedquantity" 
                    name="Receivedquantity" 
                    value={formData.Receivedquantity} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Shippedquantity" 
                    name="Shippedquantity" 
                    value={formData.Shippedquantity} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Dateoperation" 
                    name="Dateoperation" 
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