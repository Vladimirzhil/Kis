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
router.get('/LowerLevel/:id', (req, res) => {
    const { id } = req.params;

    // Запрос для выборки нижнего уровня выбранного элемента
    const lowerLevelQuery = `
DECLARE @RootId INT = ?;  

WITH Subcomponents AS (
    SELECT
        Id,
        ParentId,
        Description,
        Measure,
        CAST(1.0 AS FLOAT) AS TotalRequired  -- Явное указание типа данных
    FROM specification
    WHERE Id = @RootId  

    UNION ALL

    SELECT
        s.Id,
        s.ParentId,
        s.Description,
        s.Measure,
        CAST(sc.TotalRequired * s.QuantityPerParent AS FLOAT) AS TotalRequired  
    FROM specification s
    INNER JOIN Subcomponents sc ON s.ParentId = sc.Id
),
LeafComponents AS (
    SELECT *
    FROM Subcomponents
    WHERE NOT EXISTS (
        SELECT 1
        FROM specification
        WHERE ParentId = Subcomponents.Id
    )
)
SELECT
    Id,
    ParentId,
    Description,
    Measure,
    SUM(TotalRequired) AS TotalRequiredForProduction
FROM LeafComponents
GROUP BY Id, ParentId, Description, Measure
OPTION (MAXRECURSION 0);`;

    sql.query(connectionString, lowerLevelQuery, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error', details: err.message });
        } else {
            res.status(200).json(result);
        }
    });
});


router.post('/Post', (req, res) => {
    const { ParentId, Description, QuantityPerParent, Measure } = req.body;

    if ( !Description || !QuantityPerParent || !Measure) {
        return res.status(400).json({ message: ' ParentId, Description, QuantityPerParent, and Measure are required' });
    }

    const query = "INSERT INTO Specification (ParentId, Description, QuantityPerParent, Measure) VALUES (NULLIF(?, 0), ?, ?, ?)";
    sql.query(connectionString, query, [ParentId, Description, QuantityPerParent, Measure], (err, result) => {
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
    const { ParentId, Description, QuantityPerParent, Measure } = req.body;

    if ( !Description || !QuantityPerParent || !Measure) {
        return res.status(400).json({ message: 'ParentId, Description, QuantityPerParent, and Measure are required' });
    }

    const query = `UPDATE Specification SET ParentId=?, Description=?, QuantityPerParent=?, Measure=? WHERE Id=?`;
    const values = [ParentId, Description, QuantityPerParent, Measure, id];

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

    const query = `
    WITH RecursiveDelete AS (
        SELECT Id
        FROM specification
        WHERE Id = ? 
    
        UNION ALL
    
        SELECT t.Id
        FROM specification t
        INNER JOIN RecursiveDelete rd ON t.ParentId = rd.Id
    )
    DELETE FROM specification
    WHERE Id IN (SELECT Id FROM RecursiveDelete);`;
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
