const connectionString = require('./connection.js');
const express = require('express');
const sql = require('msnodesqlv8');
const router = express.Router();

router.use(express.json());

router.get('/Get', (req, res) => {
    const query = "SELECT * FROM Specification";

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
    const { ParentId, NameElement, QuantityPerParent, Measure } = req.body;

    if ( !ParentId || !NameElement || !QuantityPerParent || !Measure) {
        return res.status(400).json({ message: ' ParentId, NameElement, QuantityPerParent, and Measure are required' });
    }

    const query = "INSERT INTO Specification (ParentId, NameElement, QuantityPerParent, Measure) VALUES (?, ?, ?, ?)";
    sql.query(connectionString, query, [ParentId, NameElement, QuantityPerParent, Measure], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.status(201).json({ message: 'Specification created successfully' });
        }
    });
});

router.put('/Put/:id', (req, res) => {
    const { id } = req.params;
    const { ParentId, NameElement, QuantityPerParent, Measure } = req.body;

    if (!ParentId || !NameElement || !QuantityPerParent || !Measure) {
        return res.status(400).json({ message: 'ParentId, NameElement, QuantityPerParent, and Measure are required' });
    }

    const query = `UPDATE Specification SET ParentId=?, NameElement=?, QuantityPerParent=?, Measure=? WHERE Id=?`;
    const values = [ParentId, NameElement, QuantityPerParent, Measure, id];

    sql.query(connectionString, query, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.status(200).json({ message: 'Specification updated successfully' });
        }
    });
});

router.delete('/Delete/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM Specification WHERE Id=?`;
    const values = [id];

    sql.query(connectionString, query, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Specification not found' });
            }
            res.status(200).json({ message: 'Specification deleted successfully' });
        }
    });
});

module.exports = router;
