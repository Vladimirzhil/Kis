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
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [dateForCalculation, setDateForCalculation] = useState('');
    const [tableData, setTableData] = useState([]);
    const [tableData1, setTableData1] = useState([]);
    const [tableData2, setTableData2] = useState([]);
    const [calculationResult, setCalculationResult] = useState([]);

    useEffect(() => {
        getData();
    }, []);


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

    const getCompleteDecompositionforDate = () => {
        axios.get(`http://localhost:3001/api/orders/CompleteDecomposition/Date?Orderdate=${dateForCalculation}`)
            .then((response) => {
                setTableData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    const subtractTotalQuantityById = () => {
        const quantitiesById1 = {};
        tableData1.forEach(item => {
            quantitiesById1[item.Id] = item.TotalQuantity1;
        });
    
        const quantitiesById2 = {};
        tableData2.forEach(item => {
            quantitiesById2[item.Id] = item.TotalQuantity1;
        });
    
        const result = {};
        Object.keys(quantitiesById1).forEach(id => {
            if (quantitiesById2[id] !== undefined) {
                result[id] = quantitiesById1[id] - quantitiesById2[id];
            }
        });
    
        setCalculationResult(result);
    };

    useEffect(() => {
        setTableData1([]);
        setTableData2([]);
    }, [dateForCalculation]);

    useEffect(() => {
        if (tableData1.length > 0 && tableData2.length > 0) {
            subtractTotalQuantityById();
        }
    }, [tableData1, tableData2]);

    const getCalculationforDate = () => {
        axios.get(`http://localhost:3001/api/stocks/CompleteDecomposition/Date?Dateoperation=${dateForCalculation}`)
            .then((response1) => {
                setTableData1(response1.data);
                return axios.get(`http://localhost:3001/api/orders/CompleteDecomposition/Date?Orderdate=${dateForCalculation}`);
            })
            .then((response2) => {
                setTableData2(response2.data);
                subtractTotalQuantityById();
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
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
            <h2>Расчет на дату</h2>
                <Input 
                    label="Дата заказа" 
                    name="Orderdate" 
                    value={dateForCalculation} 
                    onChange={handleDateInputChange} 
                />
            <Button className="control-button" onClick={getCompleteDecompositionforDate}>Расчитать</Button>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Идентификатор</Table.HeaderCell>
                            <Table.HeaderCell>Описание</Table.HeaderCell>
                            <Table.HeaderCell>Измерение</Table.HeaderCell>
                            <Table.HeaderCell>Общее количество</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {tableData.map((data, index) => (
                            <Table.Row key={index}>
                                <Table.Cell>{data.Id}</Table.Cell>
                                <Table.Cell>{data.Description1}</Table.Cell>
                                <Table.Cell>{data.Measure}</Table.Cell>
                                <Table.Cell>{data.TotalQuantity1}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
                <Button className="control-button" onClick={getCalculationforDate}>Расчитать</Button>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Идентификатор</Table.HeaderCell>
                            <Table.HeaderCell>Описание</Table.HeaderCell>
                            <Table.HeaderCell>Измерение</Table.HeaderCell>
                            <Table.HeaderCell>Результат расчета</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {Object.keys(calculationResult).map((key) => (
                            <Table.Row key={key}>
                                <Table.Cell>{key}</Table.Cell>
                                <Table.Cell>{tableData1.find(item => item.Id === parseInt(key, 10))?.Description1}</Table.Cell>
                                <Table.Cell>{tableData1.find(item => item.Id === parseInt(key, 10))?.Measure}</Table.Cell>
                                <Table.Cell>{calculationResult[key]}</Table.Cell>
                            </Table.Row>
                     ))}
                    </Table.Body>
                </Table>
                <Button className="control-button" onClick={closeModal}>Закрыть</Button>
            </Modal>
        </div>
    );
}
