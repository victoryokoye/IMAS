# Intern Management & Attendance System (V1)

A centralized, web-based management platform designed to replace manual, physical-book attendance logging and record-keeping for interns. The system provides secure role-based access, controlled PIN-based attendance verification, project tracking, and centralized reporting for authorized company staff.

---

## 📌 Features

### 🔐 Staff Authentication & Authorization
* **Secure Access:** JWT-based authentication using HTTP-only cookies.
* **Role-Based Access Control (RBAC):** Restricts system actions based on assigned user roles (`Administrator`, `Supervisor`, `Intern Coordinator`).

### 🧑‍🎓 Intern Management
* Register, update, and search intern records.
* Maintain demographic, contact, group/class classification, and skills data.
* Activate or deactivate intern records.
* Set and reset secure, hashed attendance PINs for interns.

### ⏱️ Controlled Attendance Management
* **Coordinator-Facilitated Process:** Prevents unauthorized self-service attendance logging by forcing actions to go through an authorized Intern Coordinator.
* **PIN Verification:** Interns enter their hashed personal PIN to confirm sign-in/sign-out actions.
* **Automated Audit Trails:** Records timestamps and tracks which staff member authorized each attendance event.
* **Validation Rules:** Prevents duplicate sign-ins and invalid sign-outs.

### 📊 Attendance Records & History
* Real-time tracking of today’s attendance status (Currently Signed-In, Already Signed-Out).
* Filterable historical attendance logs per intern.
* Historical modification and deletion restricted exclusively to Administrators.

### 📁 Project Management
* Record and track intern involvement in company and technical class projects.
* Multi-participant support via a Many-to-Many (`Intern ↔ Project`) relationship.
* Tracks project statuses (`Open`, `Completed`, `Abandoned`, `Cancelled`), departments, and timelines.

### 📈 Operational Dashboard
* Centralized dashboard showing key operational metrics:
  * Total Active Interns
  * Interns Present Today
  * Currently Signed In vs. Already Signed Out
  * Recent Attendance Activity

---

## 👥 Roles & Permissions Matrix

The system enforces three operational roles:

| Feature / Action | Administrator | Supervisor | Intern Coordinator |
| :--- | :---: | :---: | :---: |
| **Manage Staff Accounts** | ✅ | ❌ | ❌ |
| **View Staff Accounts** | ✅ | ❌ | ❌ |
| **Create / View / Update Interns** | ✅ | ✅ | ✅ |
| **Deactivate Interns** | ✅ | ✅ | ❌ |
| **Set / Reset Intern PIN** | ✅ | ✅ | ✅ |
| **Create / Update / Cancel Projects** | ✅ | ✅ | ❌ |
| **Link Interns to Projects** | ✅ | ✅ | ❌ |
| **Record Attendance (Coordinator flow)** | ✅ | ❌ | ✅ |
| **View Attendance & History** | ✅ | ✅ | ✅ |
| **Modify / Delete Attendance Logs** | ✅ | ❌ | ❌ |

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React + Vite + JavaScript
* **Styling:** Tailwind CSS
* **Routing:** React Router
* **State Management:** TanStack Query (Server State), Zustand (Client Global State)
* **HTTP Client:** Axios

### Backend
* **Runtime:** Node.js + Express.js + TypeScript
* **Validation & Security:** Zod schemas, bcrypt (password & PIN hashing), JWT, CORS
* **Database & ORM:** PostgreSQL + Prisma ORM

### Infrastructure & Tooling
* **Containerization:** Docker & Docker Compose
* **Version Control:** Git & GitHub

---

## 🗄️ Database Architecture

The core relational database consists of four primary entities:

```
+---------------+        1:N        +------------------+
|     Staff     | ----------------> |    Attendance    |
+---------------+ (Authorized By)   +------------------+
                                             ^
                                             | 1:N
                                             v
                                    +------------------+
                                    |      Intern      |
                                    +------------------+
                                             ^
                                             | N:M
                                             v
                                    +------------------+
                                    |     Project      |
                                    +------------------+
```

### Entity Schemas Summary

* **Staff:** `id`, `name`, `email`, `password` (hash), `role`, `status`, `createdAt`, `updatedAt`
* **Intern:** `id`, `name`, `phone`, `email`, `group`, `techArea`, `course`, `skills`, `startDate`, `endDate`, `status`, `pin` (hash), `createdAt`, `updatedAt`
* **Project:** `id`, `name`, `description`, `techArea`, `department`, `status`, `startDate`, `endDate`, `createdAt`, `updatedAt`
* **Attendance:** `id`, `internId`, `date`, `signInTime`, `signOutTime`, `signedInBy`, `signedOutBy`, `status`, `createdAt`, `updatedAt`

---

## 📂 Repository Structure

```text
intern-management-system/
├── frontend/                  # React + Vite TypeScript App
│   ├── src/
│   │   ├── assets/            # Static assets
│   │   ├── components/        # Reusable UI components
│   │   ├── layouts/           # Page layouts
│   │   ├── pages/             # Route pages
│   │   ├── routes/            # Route configurations & protected routes
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API & Axios client
│   │   ├── stores/            # Zustand global stores
│   │   ├── types/             # TypeScript definitions
│   │   └── utils/             # Helper utilities
│   ├── App.tsx
│   ├── main.tsx
│   ├── Dockerfile
│   └── package.json
├── backend/                   # Node.js + Express TypeScript API
│   ├── src/
│   │   ├── config/            # Environment & DB configurations
│   │   ├── controllers/       # HTTP Request/Response handlers
│   │   ├── middlewares/       # Auth, error handling, validation
│   │   ├── routes/            # Express endpoints
│   │   ├── services/          # Core business logic
│   │   ├── schemas/           # Zod validation schemas
│   │   └── utils/             # Backend utilities
│   ├── prisma/                # Prisma ORM schemas & migrations
│   │   └── schema.prisma
│   ├── tests/                 # Backend test suites
│   ├── app.ts                 # Express app initialization
│   ├── server.ts              # HTTP server entrypoint
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml         # Container orchestration (Frontend, Backend, Postgres)
├── .env.example               # Template for environment variables
├── .gitignore
└── README.md                  # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
* [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed locally.
* Alternatively, [Node.js (v18+)](https://nodejs.org/) and a local [PostgreSQL](https://www.postgresql.org/) instance.

### Running with Docker Compose (Recommended)

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-org/intern-management-system.git
   cd intern-management-system
   ```

2. **Set Up Environment Variables:**
   Create `.env` files in both the root/backend directories using the provided templates:
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

3. **Build and Run Containers:**
   ```bash
   docker-compose up --build
   ```

4. **Access the Applications:**
   * **Frontend:** `http://localhost:5173`
   * **Backend API:** `http://localhost:5000`

---

## 📄 License

This project is proprietary and intended for internal company use.
