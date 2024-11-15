# Car Management Application

This project is a full-stack car management application that allows users to create, edit, and manage their car collections. The application is built using React for the frontend and Node.js with Express for the backend. MongoDB is used as the database to store car and user information.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Folder Structure](#folder-structure)

## Features

- User authentication (register, login, logout)
- Create, edit, and delete car entries
- Upload and manage car images (up to 10 images per car)
- View a list of cars and detailed car information
- Responsive design

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Backend Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/shruthiamu14/spyne.git
    cd spyne/backend
    ```

2. Install backend dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the `backend` directory and add the following environment variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4. Start the backend server:
    ```sh
    npm start
    ```

### Frontend Setup

1. Navigate to the frontend directory:
    ```sh
    cd ../frontend
    ```

2. Install frontend dependencies:
    ```sh
    npm install
    ```

3. Start the frontend development server:
    ```sh
    npm start
    ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Register a new account or log in with an existing account.
3. Start managing your car collection by adding, editing, or deleting car entries.

## API Documentation

The backend API is documented using Swagger. After starting the backend server, you can access the API documentation at `http://localhost:5000/api/docs`.

## Folder Structure

```
car-management-app/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── app.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── styles/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── package.json
├── README.md
└── package.json
```
