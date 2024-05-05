import axios from 'axios';
import React, { useState, useEffect } from 'react';
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
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [dateForCalculation, setDateForCalculation] = useState('');
    const [tableData, setTableData] = useState([]);

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

    const handleDateInputChange = (event) => {
        const { value } = event.target;
        setDateForCalculation(value);
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const getDataforDate = () => {
        axios.get(`http://localhost:3001/api/stocks/Get/Date?Dateoperation=${dateForCalculation}`)
            .then((response) => {
                setTableData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    return (
        <div>
            <Table singleLine>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Идентификатор спецификации</Table.HeaderCell>
                        <Table.HeaderCell>Прибыло</Table.HeaderCell>
                        <Table.HeaderCell>Убыло</Table.HeaderCell>
                        <Table.HeaderCell>Дата операции</Table.HeaderCell>
                        <Table.HeaderCell>Обновить</Table.HeaderCell>
                        <Table.HeaderCell>Удалить</Table.HeaderCell>
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
            <Button className="custom-button" onClick={openCreateModal}>Добавить</Button>
            <Button className="custom-button" onClick={openModal}>Расчет на дату</Button>
            <Modal isOpen={updateModalIsOpen} onRequestClose={closeUpdateModal}>
                <h2>Обновить запись</h2>
                <Input 
                    label="Идентификатор спецификации" 
                    name="SpecificationId" 
                    value={formData.SpecificationId} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Прибыло" 
                    name="Receivedquantity" 
                    value={formData.Receivedquantity} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Убыло" 
                    name="Shippedquantity" 
                    value={formData.Shippedquantity} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Дата операции" 
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
                <h2>Создать запись</h2>
                <Input 
                    label="Идентификатор спецификации" 
                    name="SpecificationId" 
                    value={formData.SpecificationId} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Прибыло" 
                    name="Receivedquantity" 
                    value={formData.Receivedquantity} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Убыло" 
                    name="Shippedquantity" 
                    value={formData.Shippedquantity} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Дата операции" 
                    name="Dateoperation" 
                    value={formData.Dateoperation} 
                    onChange={handleInputChange} 
                />
                <div style={{ marginTop: '10px' }}>
                    <Button className="control-button" onClick={onCreate}>Сохранить</Button>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <Button className="control-button" onClick={closeCreateModal}>Отменить</Button>
                </div>
            </Modal>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                <h2>Расчет на дату</h2>
                <Input 
                    label="Дата операции" 
                    name="Dateoperation" 
                    value={dateForCalculation} 
                    onChange={handleDateInputChange} 
                />
                <Button className="control-button" onClick={getDataforDate}>Расчитать</Button>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Название продукта</Table.HeaderCell>
                            <Table.HeaderCell>Общее количество</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {tableData.map((data, index) => (
                            <Table.Row key={index}>
                                <Table.Cell>{data.Description}</Table.Cell>
                                <Table.Cell>{data.TotalQuantity}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
                <Button className="control-button" onClick={closeModal}>Закрыть</Button>
            </Modal>
        </div>
    );
}
