import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Button } from 'semantic-ui-react';



export default function ReadStock() {
    const [APIData, setAPIData] = useState([]);

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
                                <Button className="control-button" onClick={() => setData(data)}>Update</Button>
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