import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Button, Input } from 'semantic-ui-react';
import Modal from 'react-modal';

export default function ReadSpecification() {
    const [APIData, setAPIData] = useState([]);
    const [lowerLevelData, setLowerLevelData] = useState([]);
    const [lowerLevelModalIsOpen, setLowerLevelModalIsOpen] = useState(false);
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

    const getData = () => {
        axios.get('http://localhost:3001/api/specifications/Get')
            .then((response) => {
                setAPIData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    const openLowerLevelModal = (id) => {
        axios.get(`http://localhost:3001/api/specifications/LowerLevel/${id}`)
            .then((response) => {
                setLowerLevelData(response.data);
                setLowerLevelModalIsOpen(true);
            })
            .catch((error) => {
                console.error('Error fetching lower level data:', error);
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
    //adpkapdapdkapdo,a

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

    const closeLowerLevelModal = () =>{
        setLowerLevelModalIsOpen(false);
    };

    return (
        <div>
            <Table singleLine>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Идентификатор</Table.HeaderCell>
                        <Table.HeaderCell>Идентификатор родителя</Table.HeaderCell>
                        <Table.HeaderCell>Описание</Table.HeaderCell>
                        <Table.HeaderCell>Количестов на родителя</Table.HeaderCell>
                        <Table.HeaderCell>Измерение</Table.HeaderCell>
                        <Table.HeaderCell>Обновить</Table.HeaderCell>
                        <Table.HeaderCell>Удалить</Table.HeaderCell>
                        <Table.HeaderCell>Нижний уровень</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {APIData.map((data) => (
                        <Table.Row key={data.Id}>
                            <Table.Cell>{data.Id}</Table.Cell>
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
                            <Table.Cell>
                                <Button className="control-button" onClick={() => openLowerLevelModal(data.Id)}>Состоит из</Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <Button className="custom-button" onClick={openCreateModal}>Добавить</Button>
            <Modal isOpen={updateModalIsOpen} onRequestClose={closeUpdateModal}>
                <h2>Обновить запись</h2>
                <Input 
                    label="Идентификатор родителя" 
                    name="ParentId" 
                    value={formData.ParentId} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Описание" 
                    name="Description" 
                    value={formData.Description} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Количестов на родителя" 
                    name="QuantityPerParent" 
                    value={formData.QuantityPerParent} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Измерение" 
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
                <h2>Добавить запись</h2>
                <Input 
                    label="Идентификатор родителя" 
                    name="ParentId" 
                    value={formData.ParentId} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Описание" 
                    name="Description" 
                    value={formData.Description} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Количестов на родителя" 
                    name="QuantityPerParent" 
                    value={formData.QuantityPerParent} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="Измерение" 
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
            <Modal isOpen={lowerLevelModalIsOpen} onRequestClose={closeLowerLevelModal}>
            <h2>Lower Level Details</h2>
            <Table singleLine>
                <Table.Header>
                        <Table.HeaderCell>Идентификатор</Table.HeaderCell>
                        <Table.HeaderCell>Идентификатор родителя</Table.HeaderCell>
                        <Table.HeaderCell>Описание</Table.HeaderCell>
                        <Table.HeaderCell>Необходимое количество для производства</Table.HeaderCell>
                        <Table.HeaderCell>Измерение</Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                    {lowerLevelData.map((item) => (
                        <Table.Row key={item.Id}>
                            <Table.Cell>{item.Id}</Table.Cell>
                            <Table.Cell>{item.ParentId}</Table.Cell>
                            <Table.Cell>{item.Description}</Table.Cell>
                            <Table.Cell>{item.TotalRequiredForProduction}</Table.Cell>
                            <Table.Cell>{item.Measure}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <div style={{ marginTop: '10px' }}>
                <Button className="control-button" onClick={closeLowerLevelModal}>Закрыть</Button>
            </div>
        </Modal>
        </div>
    );
}
