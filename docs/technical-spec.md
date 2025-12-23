# Technical Specification

## 1. Project Folder Structure
To maintain a professional, production-ready codebase, the project is organized as follows:

```text
multi-tenant-saas-platform/
├── docs/                   # Documentation & Diagrams
├── backend/                # Node.js Express API
│   ├── src/
│   │   ├── controllers/    # Route logic
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth & Tenant isolation
│   │   └── config/         # DB connection
│   ├── migrations/         # SQL table creation
│   └── tests/              # API testing
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI parts
│   │   ├── pages/          # Main views (Dashboard, etc.)
│   │   ├── services/       # API calls (Axios)
│   │   └── context/        # Auth state management
└── docker-compose.yml      # Orchestration file