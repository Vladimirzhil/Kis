const express = require('express');
const app = express();
const cors = require('cors');
const ControllerSpecification = require('./ControllerSpecification');
const ControllerOrder = require('./ControllerOrder_');
const ControllerStock = require('./ControllerStock');

app.use(express.json());

app.use(cors());

// Используйте экспортированные роутеры в приложении
app.use('/api/specifications', ControllerSpecification);
app.use('/api/orders', ControllerOrder);
app.use('/api/stocks',ControllerStock);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

