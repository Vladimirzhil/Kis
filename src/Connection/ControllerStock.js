const connectionString = require('./connection.js');
const express = require('express');
const sql = require('msnodesqlv8');
const router = express.Router();


router.use(express.json());

router.get('/Get', (req, res) => {
    const query = "SELECT * FROM Stock";

    sql.query(connectionString, query, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(rows);
        }
    });
});
router.get('/Get/Date',(req,res)=>{
    const Dateoperation = req.query.Dateoperation;

    if ( !Dateoperation) {
        return res.status(400).json({ message: 'Dateoperation are required' });
    }

    const query ='SELECT SpecificationId, SUM(Receivedquantity) - SUM(Shippedquantity) from Stock Where Dateoperation<=? Group by SpecificationId '
    sql.query(connectionString, query, [Dateoperation], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.status(201).json(result);
        }
    });
});

router.post('/Post', (req, res) => {
    const {SpecificationId, Receivedquantity, Shippedquantity, Dateoperation} = req.body;

    if ( !SpecificationId || !Dateoperation) {
        return res.status(400).json({ message: 'SpecificationId, Receivedquantity, Shippedquantity and Dateoperation are required' });
    }

    const query = "INSERT INTO Stock (SpecificationId, Receivedquantity, Shippedquantity, Dateoperation) VALUES (?, ?, ?, ?)";
    sql.query(connectionString, query, [SpecificationId, Receivedquantity, Shippedquantity,Dateoperation], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.status(201).json({ message: 'Stock created successfully' });
        }
    });
});

router.put('/Put/:id', (req, res) => {
    const { id } = req.params;
    const {SpecificationId, Receivedquantity, Shippedquantity, Dateoperation} = req.body;

    if (!SpecificationId || !Dateoperation) {
        return res.status(400).json({ message: 'SpecificationId, Receivedquantity, Shippedquantity and Dateoperation are required' });
    }
    
    const query = `UPDATE Stock SET SpecificationId=?, Receivedquantity=?, Shippedquantity=?, Dateoperation=? WHERE Id=?`;
    const values = [SpecificationId, Receivedquantity, Shippedquantity, Dateoperation, id];

    sql.query(connectionString, query, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.status(200).json({ message: 'Stock updated successfully' });
        }
    });
});

router.delete('/Delete/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM Stock WHERE Id=?`;
    const values = [id];

    sql.query(connectionString, query, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Stock not found' });
            }
            res.status(200).json({ message: 'Stock deleted successfully' });
        }
    });
});

module.exports = router;