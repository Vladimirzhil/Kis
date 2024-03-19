const connectionString = require('./connection.js');
const express = require('express');
const sql = require('msnodesqlv8');
const router = express.Router();


router.use(express.json());

router.get('/Get', (req, res) => {
    const query = "SELECT * FROM Order_";

    sql.query(connectionString, query, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(rows);
        }
    });
});

router.post('/Post', (req, res) => {
    const { SpecificationId, Orderdate, ClientName,Count, Measure } = req.body;

    if ( !SpecificationId || !Orderdate || !ClientName || !Count || !Measure) {
        return res.status(400).json({ message: ' SpecificationId, Orderdate , ClientName , Count and Measure are required' });
    }

    const query = "INSERT INTO Order_ (SpecificationId, Orderdate , ClientName , Count ,Measure ) VALUES (?, ?, ?, ?,?)";
    sql.query(connectionString, query, [SpecificationId, Orderdate, ClientName,Count, Measure], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.status(201).json({ message: 'Order created successfully' });
        }
    });
});

router.put('/Put/:id', (req, res) => {
    const { id } = req.params;
    const { SpecificationId, Orderdate, ClientName,Count, Measure } = req.body;

    if (!SpecificationId || !Orderdate || !ClientName || !Count || !Measure) {
        return res.status(400).json({ message: ' SpecificationId, Orderdate , ClientName , Count and Measure are required' });
    }

    const query = `UPDATE Order_ SET SpecificationId=?, Orderdate=?, ClientName=?,Count=?, Measure=? WHERE Id=?`;
    const values = [SpecificationId, Orderdate, ClientName,Count, Measure, id];

    sql.query(connectionString, query, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.status(200).json({ message: 'Order updated successfully' });
        }
    });
});

router.delete('/Delete/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM Order_ WHERE Id=?`;
    const values = [id];

    sql.query(connectionString, query, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json({ message: 'Order deleted successfully' });
        }
    });
});

module.exports = router;