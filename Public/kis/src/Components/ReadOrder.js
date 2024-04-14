import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Button } from 'semantic-ui-react';


export default function ReadOrder() {
    const [APIData, setAPIData] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const setData = (data) => {
        localStorage.setItem('Id', data.Id);
        localStorage.setItem('SpecificationId', data.SpecificationId);
        localStorage.setItem('Orderdate', data.Orderdate);
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

    return (
        <div>
            <Table singleLine>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>SpecificationId</Table.HeaderCell>
                        <Table.HeaderCell>Orderdate</Table.HeaderCell>
                        <Table.HeaderCell>ClientName</Table.HeaderCell>
                        <Table.HeaderCell>Count</Table.HeaderCell>
                        <Table.HeaderCell>Update</Table.HeaderCell>
                        <Table.HeaderCell>Delete</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {APIData.map((data) => (
                        <Table.Row key={data.Id}>
                            <Table.Cell>{data.SpecificationId}</Table.Cell>
                            <Table.Cell>{data.Orderdate}</Table.Cell>
                            <Table.Cell>{data.ClientName}</Table.Cell>
                            <Table.Cell>{data.Count}</Table.Cell>
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

