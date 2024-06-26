const { body } = require('express-validator');

exports.ProductValidation = [
    body('title')
        .trim()
        .isString()
        .withMessage('Only characters and numbers are allowed in the title')
        .isLength({ min: 3 })
        .withMessage('Title length must be at least 3 characters')
    ,
    body('price', 'Price must be greater than zero')
        .trim()
        .isFloat({
            gt: 0
        })
    ,
    body('description', 'Description length must be at least 10 characters')
        .isLength({ min: 8 })
    ,
    body('quantity', 'Quantity must be a positive integer number')
        .trim()
        .isInt({
            allow_leading_zeroes: false,
            gt: 0
        })
]