intern-management-system/
│
├── frontend/ # React frontend application
│ │
│ ├── src/
│ │ │
│ │ ├── components/ # Reusable UI components
│ │ │ ├── common/ # General reusable components
│ │ │ ├── forms/ # Reusable form components
│ │ │ └── ui/ # Buttons, inputs, modals, etc.
│ │ │
│ │ ├── layouts/ # Application page layouts
│ │ │ ├── AuthLayout.tsx # Layout for authentication pages
│ │ │ └── DashboardLayout.tsx # Main dashboard layout
│ │ │
│ │ ├── pages/ # Application pages
│ │ │ ├── auth/ # Login and authentication pages
│ │ │ ├── dashboard/ # Dashboard pages
│ │ │ ├── staff/ # Staff management pages
│ │ │ ├── interns/ # Intern management pages
│ │ │ ├── projects/ # Project management pages
│ │ │ └── attendance/ # Attendance pages
│ │ │
│ │ ├── routes/ # Application routing
│ │ │ ├── AppRoutes.tsx # Main route definitions
│ │ │ └── ProtectedRoute.tsx # Protects authenticated routes
│ │ │
│ │ ├── hooks/ # Reusable React hooks
│ │ │
│ │ ├── services/ # API communication
│ │ │ ├── api.ts # Axios instance/configuration
│ │ │ ├── auth.service.ts # Authentication API calls
│ │ │ ├── staff.service.ts # Staff API calls
│ │ │ ├── intern.service.ts # Intern API calls
│ │ │ ├── project.service.ts # Project API calls
│ │ │ └── attendance.service.ts # Attendance API calls
│ │ │
│ │ ├── stores/ # Global Zustand state
│ │ │ └── auth.store.ts # Authentication/user state
│ │ │
│ │ ├── types/ # Frontend TypeScript types
│ │ │
│ │ ├── utils/ # Frontend helper functions
│ │ │
│ │ ├── assets/ # Images, icons and static assets
│ │ │
│ │ ├── App.tsx # Root React component
│ │ └── main.tsx # React application entry point
│ │
│ ├── public/ # Public static files
│ ├── Dockerfile # Frontend Docker image
│ ├── package.json # Frontend dependencies/scripts
│ ├── vite.config.ts # Vite configuration
│ ├── tsconfig.json # TypeScript configuration
│ └── .env # Frontend environment variables
│
│
├── backend/ # Node.js + Express TypeScript API
│ │
│ ├── src/
│ │ │
│ │ ├── auth/ # Authentication feature
│ │ │ ├── auth.controller.ts # Handles auth requests/responses
│ │ │ ├── auth.service.ts # Login, registration and JWT logic
│ │ │ ├── auth.routes.ts # Authentication API routes
│ │ │ ├── auth.schema.ts # Auth Zod validation schemas
│ │ │ └── auth.types.ts # Custom auth TypeScript types
│ │ │
│ │ ├── staff/ # Staff management feature
│ │ │ ├── staff.controller.ts # Staff request handlers
│ │ │ ├── staff.service.ts # Staff business logic
│ │ │ ├── staff.routes.ts # Staff API routes
│ │ │ └── staff.schema.ts # Staff validation schemas
│ │ │
│ │ ├── interns/ # Intern management feature
│ │ │ ├── intern.controller.ts # Intern request handlers
│ │ │ ├── intern.service.ts # Intern business logic
│ │ │ ├── intern.routes.ts # Intern API routes
│ │ │ └── intern.schema.ts # Intern validation schemas
│ │ │
│ │ ├── projects/ # Project management feature
│ │ │ ├── project.controller.ts # Project request handlers
│ │ │ ├── project.service.ts # Project business logic
│ │ │ ├── project.routes.ts # Project API routes
│ │ │ └── project.schema.ts # Project validation schemas
│ │ │
│ │ ├── attendance/ # Attendance feature
│ │ │ ├── attendance.controller.ts # Attendance request handlers
│ │ │ ├── attendance.service.ts # Attendance business logic
│ │ │ ├── attendance.routes.ts # Attendance API routes
│ │ │ └── attendance.schema.ts # Attendance validation schemas
│ │ │
│ │ ├── middleware/ # Reusable Express middleware
│ │ │ ├── auth.middleware.ts # Verifies authenticated users
│ │ │ ├── role.middleware.ts # Checks user roles/permissions
│ │ │ ├── error.middleware.ts # Central error handling
│ │ │ ├── validate.middleware.ts # Runs Zod validation
│ │ │ └── rateLimit.middleware.ts # Limits excessive requests
│ │ │
│ │ ├── config/
│ │ │ └── env.ts # Environment configuration
│ │ │
│ │ ├── lib/
│ │ │ ├── prisma.ts # Prisma database client
│ │ │ └── jwt.ts # JWT helper functions
│ │ │
│ │ ├── utils/
│ │ │ ├── hash.ts # Password/PIN hashing
│ │ │ ├── pin.ts # PIN helper functions
│ │ │ ├── response.ts # Standard API responses
│ │ │ └── date.ts # Date/time helpers
│ │ │
│ │ ├── types/
│ │ │ └── express.d.ts # Express request type extensions
│ │ │
│ │ ├── app.ts # Express application setup
│ │ └── server.ts # Starts the HTTP server
│ │
│ ├── prisma/
│ │ ├── schema.prisma # Database schema
│ │ └── migrations/ # Database migration history
│ │
│ ├── tests/ # Backend tests
│ ├── Dockerfile # Backend Docker image
│ ├── package.json # Backend dependencies/scripts
│ ├── tsconfig.json # TypeScript configuration
│ └── .env # Backend environment variables
│
│
├── docker-compose.yml # Runs frontend, backend and PostgreSQL
├── .env # Root environment configuration
├── .gitignore # Files excluded from Git
└── README.md # Project documentation
