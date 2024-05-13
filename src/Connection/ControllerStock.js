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
router.get('/Get/Date', (req, res) => {
    const Dateoperation = req.query.Dateoperation;

    if (!Dateoperation) {
        return res.status(400).json({ message: 'Dateoperation are required' });
    }

    const query ='SELECT Specification.Description, SUM(Receivedquantity) - SUM(Shippedquantity) AS TotalQuantity FROM Stock INNER JOIN Specification ON Specification.id = Stock.SpecificationId WHERE Dateoperation <= CAST(? AS DATE)  GROUP BY Description';
    sql.query(connectionString, query, [Dateoperation], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.status(201).json(result);
        }
    });
});

router.get('/CompleteDecomposition/Date', (req, res) => {
    const Dateoperation = req.query.Dateoperation;

    if (!Dateoperation) {
        return res.status(400).json({ message: 'Dateoperation are required' });
    }

    const query = `
    DECLARE @DateOperation DATE = CAST(? AS DATE); 

    WITH InitialStock AS (
    SELECT
        SpecificationId,
        SUM(Receivedquantity) - SUM(Shippedquantity) AS TotalQuantity
    FROM Stock
    WHERE Dateoperation <= @DateOperation
    GROUP BY SpecificationId
),
RecursiveComponents AS (
    SELECT
        s.Id,
        s.ParentId,
        s.Description,
        s.Measure,
        CAST(ISNULL(st.TotalQuantity, 0) AS FLOAT) AS TotalQuantity,
        CASE 
            WHEN EXISTS(SELECT 1 FROM Specification WHERE ParentId = s.Id) THEN 0 
            ELSE 1 
        END AS IsLeaf
    FROM Specification s
    LEFT JOIN InitialStock st ON s.Id = st.SpecificationId

    UNION ALL

    SELECT
        s.Id,
        s.ParentId,
        s.Description,
        s.Measure,
        CAST(rc.TotalQuantity * s.QuantityPerParent AS FLOAT) AS TotalQuantity,
        rc.IsLeaf
    FROM Specification s
    INNER JOIN RecursiveComponents rc ON s.ParentId = rc.Id
),
AggregatedComponents AS (
    SELECT
        Id,
        Description,
        Measure,
        SUM(TotalQuantity) AS TotalQuantity,
        MAX(IsLeaf) AS IsLeaf
    FROM RecursiveComponents
    GROUP BY Id, Description, Measure
)
SELECT Id, Description AS Description1, Measure, TotalQuantity AS TotalQuantity1
FROM AggregatedComponents
WHERE TotalQuantity > 0 AND IsLeaf = 1
ORDER BY Id
OPTION (MAXRECURSION 0);
`;

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