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

router.get('/CompleteDecomposition/Date', (req, res) => {
    const Orderdate = req.query.Orderdate;

    if (!Orderdate) {
        return res.status(400).json({ message: 'Orderdate are required' });
    }

    const query = `
    DECLARE @Orderdate DATE = CAST(? AS DATE); 

WITH InitialStock AS (
    SELECT
        SpecificationId,
        SUM(Count) AS TotalQuantity
    FROM Order_
    WHERE Orderdate <= @Orderdate and status = 'не выполнено'
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
AND Id NOT IN (
    SELECT Id
    FROM Order_
)
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
    const { SpecificationId, Orderdate, Status, ClientName,Count } = req.body;

    if ( !SpecificationId || !Orderdate|| !Status || !ClientName || !Count) {
        return res.status(400).json({ message: ' SpecificationId, Orderdate, Status, ClientName and Count  are required' });
    }

    const query = "INSERT INTO Order_ (SpecificationId, Orderdate , Status, ClientName , Count  ) VALUES (?, ?, ?, ?, ?)";
    sql.query(connectionString, query, [SpecificationId, Orderdate, Status, ClientName,Count], (err, result) => {
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
    const { SpecificationId, Orderdate,Status, ClientName,Count } = req.body;

    if (!SpecificationId || !Orderdate |!Status|| !ClientName || !Count) {
        return res.status(400).json({ message: ' SpecificationId, Orderdate , Status, ClientName and Count are required' });
    }

    const query = `UPDATE Order_ SET SpecificationId=?, Orderdate=?, Status=?, ClientName=?,Count=? WHERE Id=?`;
    const values = [SpecificationId, Orderdate, Status, ClientName,Count, id];

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