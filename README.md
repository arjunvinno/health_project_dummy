# Health Record Project

The Health Record Project is a comprehensive system for managing patient records, diagnostics, and procedures. It consists of two main components: a backend server and a frontend client.

## Technologies Used

### Backend

- **Node.js**: A JavaScript runtime environment for executing server-side code.
- **Express.js**: A web application framework for Node.js, used for building RESTful APIs.
- **MongoDB**: A NoSQL database used for storing patient data.
- **Mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js, used for modeling application data.

### Frontend

- **React.js**: A JavaScript library for building user interfaces.
- **HTML**: The standard markup language for creating web pages.
- **CSS**: The style sheet language used for describing the presentation of a document written in HTML.
- **Material UI**: A popular React UI framework for implementing Google's Material Design.

## Setup Instructions

### Backend Setup

1. Navigate to the `backend` directory.
2. Run `npm i` to install backend dependencies.
3. Replace the `MONGO_URL` in the `.env` file with your MongoDB database link.
4. Run `npm run start` to start the backend server.

### Frontend Setup

1. Navigate to the `frontend` directory.
2. Run `npm i` to install frontend dependencies.
3. Replace the `hostUrl` variable in the frontend code with your server URL.
4. Run `npm run start` to start the frontend server.

## Usage

- Once both the frontend and backend servers are running, you can access the application through your web browser.
- Users can navigate through the interface to view and manage patient records, diagnostics, and procedures.


