# Primetrade.ai Backend Developer Intern Assignment

A robust, scalable REST API built with **Node.js, Express, and MongoDB**, paired with a modern **React + Vite** frontend interface. This project was developed to meet the core requirements of the Primetrade.ai Backend Developer Intern assignment, focusing heavily on security, modularity, and deployment readiness.

---

## 🎯 Evaluation Criteria Showcase

This project is explicitly designed to meet and exceed the assignment's evaluation criteria:

### ✅ API Design (REST Principles, Status Codes, Modularity)
- **RESTful Architecture**: All endpoints follow strict REST principles (e.g., `GET /api/v1/tasks`, `POST /api/v1/tasks`).
- **Standardized Responses**: Predictable JSON responses utilizing standard HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Server Error`).
- **Modularity**: The backend follows an MVC-like pattern (`controllers/`, `models/`, `routes/`, `middlewares/`), ensuring separation of concerns. Routes are versioned (`/api/v1/...`) to allow for backwards-compatible future updates.

### ✅ Database Schema Design & Management
- **MongoDB & Mongoose**: Utilizes NoSQL for flexible schema design.
- **Relational Mapping**: The `Task` schema contains a hard reference (`mongoose.Schema.ObjectId`) to the `User` schema, establishing a strict one-to-many relationship.
- **Data Integrity**: Enforces strict Mongoose validation rules (required fields, enum matching, regex for email validation, and length constraints) at the database level before data is ever saved.

### ✅ Security Practices (JWT, Hashing, Validation)
- **Stateless Authentication**: Uses JSON Web Tokens (JWT) for secure, stateless session management.
- **Password Protection**: Passwords are mathematically hashed using `bcryptjs` (with a 10-round salt) before database insertion. Passwords are never returned in API responses (`select: false`).
- **Role-Based Access Control (RBAC)**: Includes dedicated `protect` and `authorize` middlewares. A `user` can only manipulate their own tasks, while an `admin` role has elevated privileges across the entire dataset.

### ✅ Functional Frontend Integration
- **React + Vite App**: A single-page application that seamlessly connects to the backend APIs using Axios.
- **State & Session Management**: Securely handles JWT storage and manages user sessions contextually.
- **Dynamic UI**: Features a modern, glassmorphic design system to satisfy the need for a rich aesthetic, providing instant user feedback (success/error messaging) during CRUD operations.

### ✅ Scalability & Deployment Readiness
*(See the [Scalability Note](#-scalability--deployment-note) below for a detailed breakdown).*

---

## 🚀 Setup & Installation Instructions

To run this application locally, you will need two separate terminal windows for the backend and frontend.

### 1. Database Configuration
1. Open `backend/.env`.
2. Locate the `MONGO_URI` variable.
3. Replace `<YOUR_PASSWORD>` with the actual database password. *(Note: The `.env` file is intentionally ignored by `.gitignore` to prevent secret leaks in production).*

### 2. Running the Backend API
In your first terminal:
```bash
cd backend
npm install
npm run dev
```
- The API will be live at `http://localhost:5000`
- **Swagger Documentation**: Visit `http://localhost:5000/api-docs` to view and interact with the complete API documentation.

### 3. Running the Frontend Dashboard
In your second terminal:
```bash
cd frontend
npm install
npm run dev
```
- The application will be live at `http://localhost:5173`.

---

## 📈 Scalability & Deployment Note

Designing for the future requires decoupling and statelessness. This architecture is prepared for enterprise-scale traffic:

### 1. Horizontal Scaling & Microservices
Because the authentication layer uses **JWT**, the backend is completely stateless. This means we are not reliant on server memory or sticky sessions. The Express app can be containerized using **Docker** and orchestrated via **Kubernetes**. If the `Task` entity grows into a massive service, its routes and controllers can be safely extracted into an independent microservice communicating over gRPC or message queues (like RabbitMQ) without breaking the Gateway.

### 2. Caching Strategy
Currently, every `GET` request hits MongoDB. As read volume scales, we would introduce **Redis** as an in-memory caching layer. 
- Frequent queries (e.g., an Admin requesting all tasks) would be cached in Redis.
- Write operations (`POST`, `PUT`, `DELETE`) would invalidate the specific Redis cache keys to ensure data consistency, dramatically reducing the load on the primary MongoDB database.

### 3. Load Balancing & Reverse Proxy
For deployment readiness, the Node.js instances should sit behind an **Nginx** reverse proxy or an AWS Application Load Balancer (ALB). This provides SSL termination, mitigates DDoS attacks, and distributes incoming traffic evenly across multiple Node instances, ensuring high availability.

### 4. Docker Deployment 🐳
The repository is fully Dockerized for immediate production deployment. It contains Dockerfiles for both services and a root `docker-compose.yml`. The backend is containerized in a lightweight Node Alpine environment, and the frontend is built and served via a production-grade **Nginx** container.

To spin up the entire application stack with a single command:
```bash
# Ensure your MONGO_URI is set in the terminal environment or .env file
docker-compose up --build -d
```
- Frontend will be available on `http://localhost:80`
- Backend will be available on `http://localhost:5000`

---
*Developed for the Primetrade.ai engineering team evaluation.*
