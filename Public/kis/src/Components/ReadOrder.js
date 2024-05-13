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
        Orderdate: '',
        Status:'',
        ClientName: '',
        Count: ''
    });

    useEffect(() => {
        getData();
    }, []);

    const setData = (data) => {
        localStorage.setItem('Id', data.Id);
        localStorage.setItem('SpecificationId', data.SpecificationId);
        localStorage.setItem('Orderdate', data.Orderdate);
        localStorage.setItem('Status', data.Status);
        localStorage.setItem('ClientName', data.ClientName);
        localStorage.setItem('Count', data.Count);
    };

    const getData = () => {
        axios.get('http://localhost:3001/api/orders/Get')
            .then((response) => {
                setAPIData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    const onDelete = (id) => {
        axios.delete(`http://localhost:3001/api/orders/Delete/${id}`)
            .then(() => {
                getData();
            })
            .catch((error) => {
                console.error('Error deleting item:', error);
            });
    };

    const onUpdate = () => {
        axios.put(`http://localhost:3001/api/orders/Put/${formData.Id}`, formData)
            .then(() => {
                closeUpdateModal();
                getData();
            })
            .catch((error) => {
                console.error('Error updating item:', error);
            });
    };

    const onCreate = () => {
        axios.post('http://localhost:3001/api/orders/Post', formData)
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
            Orderdate: '',
            Status:'',
            ClientName: '',
            Count: ''
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
                        <Table.HeaderCell>Идентификатор спецификации</Table.HeaderCell>
                        <Table.HeaderCell>Дата заказа</Table.HeaderCell>
                        <Table.HeaderCell>Статус заказа</Table.HeaderCell>
                        <Table.HeaderCell>Имя клиента</Table.HeaderCell>
                        <Table.HeaderCell>Количество</Table.HeaderCell>
                        <Table.HeaderCell>Обновить</Table.HeaderCell>
                        <Table.HeaderCell>Удалить</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {APIData.map((data) => (
                        <Table.Row key={data.Id}>
                            <Table.Cell>{data.SpecificationId}</Table.Cell>
                            <Table.Cell>{data.Orderdate}</Table.Cell>
                            <Table.Cell>{data.Status}</Table.Cell>
                            <Table.Cell>{data.ClientName}</Table.Cell>
                            <Table.Cell>{data.Count}</Table.Cell>
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
            <Button className="custom-button" onClick={openCreateModal}>Добавить</Button>
            <Modal isOpen={updateModalIsOpen} onRequestClose={closeUpdateModal}>
                <h2>Обновить запись</h2>
                <Input 
                    label="Идентификатор спецификации" 
                    name="SpecificationId" 
                    value={formData.SpecificationId} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Дата заказа" 
                    name="Orderdate" 
                    value={formData.Orderdate} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Статус заказа" 
                    name="Status" 
                    value={formData.Status} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Имя клиента" 
                    name="ClientName" 
                    value={formData.ClientName} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Количество" 
                    name="Count" 
                    value={formData.Count} 
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
                <h2>Добавить запись</h2>
                <Input 
                    label="Идентификатор спецификации" 
                    name="SpecificationId" 
                    value={formData.SpecificationId} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Дата заказа" 
                    name="Orderdate" 
                    value={formData.Orderdate} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Статус заказа" 
                    name="Status" 
                    value={formData.Status} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Имя клиента" 
                    name="ClientName" 
                    value={formData.ClientName} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Количество" 
                    name="Count" 
                    value={formData.Count} 
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