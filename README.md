# Online Marketplace

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

## Project Description
This is an online marketplace website made using Node.js, Express framework, and MongoDB. It's my first project using Node.js and implementing the backend logic.
It allows users to register, login, reset password, see product details, add products to their cart, make orders, and sell their products.

## Features
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

## Installation
1. Clone the repository:
  ```sh
  git clone https://github.com/omarfarouk311/Online-Marketplace-NodeJs.git
  cd Online-Marketplace-NodeJs
  ```

2. Install dependencies:
  ```sh
  npm install
  ```

3. Set up environment variables
  * Create a .env file in the root directory of the project.
  * Add the following environment variables to the .env file:
  ```sh
  COOKIE_SECRET1=your-cookie-secret
  DB_URI=your-mongodb-uri
  MAILGUN_API_KEY=your-mailgun-api-key
  MAILGUN_DOMAIN=your-mailgun-domain
  SENDER_EMAIL=your-sender-email
  PORT=listening-port
  ```
4. Run the application:
  ```sh
  npm start
  ```

## Usage
* Open your browser and navigate to http://localhost:3000.
* Register a new user account.
* Login with your new account.
* Use the admin interface to add, update, or delete products.
* Explore the products, add them to your cart, and place orders.
* Download the invoices.
* Try resetting your password.

## Contributing
Contributions are welcome! Please fork this repository and create a pull request with your changes.