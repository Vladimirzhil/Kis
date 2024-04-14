import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Button } from 'semantic-ui-react';
import Modal from 'react-modal';


export default function ReadSpecification() {
    const [APIData, setAPIData] = useState([]);

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

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
    setModalIsOpen(true);
    };

    const closeModal = () => {
     setModalIsOpen(false);
    };
    const modalContent = (
        <div>
          <h2>Заголовок модального окна</h2>
          <p>Текст модального окна</p>
          <button onClick={closeModal}>Закрыть</button>
        </div>
      );

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
                                <Button className="control-button" onClick={openModal}>Update</Button>
                                <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                                {modalContent}
                                </Modal>
                            </Table.Cell>
                            <Table.Cell>
                                <Button className="control-button" onClick={() => onDelete(data.Id)}>Delete</Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
}