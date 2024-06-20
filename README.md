<h1>Online Marketplace</h1>
This is an online marketplace website made using NodeJS & Express framework and MongoDB, It's my first project using NodeJS and implementing the backend logic.
It allows users to register, login, reset password, see details of the products, add products to their cart, make orders, and sell their products.

<h2>Some details about the project:</h2>

- Applied MVC pattern.
- Implemented authentication and authorization.
- Used express-validator to implement input validation and sanitization.
- Used MongoDB driver for the database.
- Used sessions & cookies to maintain state across different user requests.
- Added CSRF protection.
- Added password reset functionality by sending emails using Mailgun API.
- Used multer package to handle product's image upload.
- Generated pdf invoice for each order by using pdfkit package.
- Implemented pagination on products and orders retrieval.