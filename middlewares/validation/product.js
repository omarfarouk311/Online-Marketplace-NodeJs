const { body } = require('express-validator');

exports.ProductValidation = [
    body('title')
        .isString()
        .withMessage('Only characters and numbers are allowed in the title')
        .isLength({ min: 3 })
        .withMessage('Title length must be at least 3 characters')
        .trim()
    ,
    body('price', 'Price must be greater than zero')
        .isFloat({
            gt: 0
        })
        .trim()
    ,
    body('description', 'Description length must be at least 10 characters')
        .isLength({ min: 8 })
    ,
    body('quantity', 'Quantity must be a positive integer number')
        .isInt({
            allow_leading_zeroes: false,
            gt: 0
        })
        .trim()
]
