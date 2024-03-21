const express = require('express');
const BodyParser = require('body-parser');
const path = require('path');
const admin_router = require('./routes/admin'), shop_router = require('./routes/shop');
const app = express();

app.use(BodyParser.urlencoded({ extended: true }));

app.use('/admin', admin_router);

app.use(shop_router);

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname,'views','404.html'));
});

app.listen(3000);
