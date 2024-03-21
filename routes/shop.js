const express = require('express');
const router = express.Router();
const path = require('path');
const root_dir = require('../util/path');

router.get('/', (req, res, next) => {
    res.sendFile(path.join(root_dir, 'views', 'shop.html'));
});

module.exports = router;
