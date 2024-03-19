const express = require('express');
const app = express();
const ControllerSpecification = require('./ControllerSpecification');
const ControllerOrder = require('./ControllerOrder_');

app.use(express.json());

// Используйте экспортированные роутеры в приложении
app.use('/api/specifications', ControllerSpecification);
app.use('/api/orders', ControllerOrder);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

