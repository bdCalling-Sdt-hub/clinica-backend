# Candymap API

This project provides a backend API for the Candymap application, which is designed to manage interactions between Normal Users (Children), Candy Givers, and Admins. The API is built using Node.js, Express, TypeScript, and Mongoose, with a focus on modularity, scalability, and role-based access control.

## Table of Contents

- [Project Overview](#project-overview)
- [Project Setup](#project-setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Analysis](#project-analysis)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

Candymap is a platform that allows children to interact with Candy Givers, who can distribute candy in various locations. Admins have the ability to manage users and content within the platform. The API handles user authentication, role-based access control, content management, and location tracking.

## Project Setup

### Prerequisites

Ensure that you have the following tools installed on your machine:

- Node.js (v18 or higher)
- Yarn (v1.22.19 or higher)
- TypeScript (v5.2 or higher)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Masumraihan/candymap-server.git
   cd candymap-server
   yarn install / yarn
   ```

2. **Set up environment variables:**

   ```bash
   check your .env.example file
   ```

3. **Start the server:**

   ```bash
   yarn dev (for development)
   ```

4. **Build**

   ```bash
   yarn build
   yarn start (for production)
   ```

## Admin Credentials

- Email: admin@gmail.com
- Password: 123456

## API Documentation

- [Swagger](https://app.swaggerhub.com/apis/MDABIDMAHMUDJISAN_1/candymap/1.0.0)
- [Postman](https://documenter.getpostman.com/view/24929762/2sAXjF9Eqc)
- [ER Diagram](https://drive.google.com/file/d/1fqEvRfN0bhRBl_j3Y0ZILgQTXgN-ouzh/view?usp=sharing)

## Project Analysis

### Architecture

The project follows a modular architecture where each feature (e.g., user management, authentication, content, location) is encapsulated in its own module. This structure promotes code reusability, scalability, and easier maintenance. The API is built using Express.js, Mongoose, with TypeScript, and has a focus on modularity, scalability, and role-based access control.

### Technology Stack

- **Node.js & Express**: Used as the backend framework for building the RESTful API.
- **TypeScript**: Used for type checking and code linting.
- **Mongoose**: Provides a schema-based solution to model data and interact with MongoDB.
- **JWT**: Used for authentication and authorization.
- **bcrypt**: Used for password hashing.
- **zod**: Used for data validation.
- **Swagger & Postman**: Used for API documentation.

### Strengths

- **Modularity**: The project follows a modular architecture, where each feature is encapsulated in its own module.
- **Role-Based Access Control**:Security is enforced through middleware, ensuring that only authorized users can perform certain actions.
- **Strong Type Safety**: TypeScript helps prevent runtime errors by catching issues during the development phase.

### Weaknesses

- **Only include necessary data**: Create this project only for assignment purpose. We can add more features later.
# clinica-backend
# clinica-backend
# clinica-backend
