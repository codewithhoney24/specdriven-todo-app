1 # Architecture: Spec-Driven Todo Platform
       2
       3 This document outlines the system architecture, technology stack, and core
         components of the Spec-Driven Todo Platform.
       4
       5 ## 1. System Overview
       6
       7 The Spec-Driven Todo Platform is a modern, full-stack workflow automation
         and task management application designed for high performance,
         scalability, and security. It follows a decoupled client-server
         architecture, utilizing a Next.js frontend and a FastAPI Python backend.
       8
       9 ### High-Level Architecture Diagram
      10 *(Conceptual)*
      11 ```text
      12 [ Client / Browser ] 
      13         │
      14         ▼ (HTTPS)
      15 [ Next.js Frontend (Vercel) ] 
      16         │
      17         ▼ (REST / JSON via Axios)
      18 [ FastAPI Backend (Python) ] 
      19         │
      20         ▼ (SQLModel / SQLAlchemy)
      21 [ PostgreSQL Database ]
      22 ```
      23
      24 ## 2. Technology Stack
      25
      26 ### Frontend (Client-Side)
      27 * **Framework:** Next.js 16+ (React)
      28 * **Language:** TypeScript
      29 * **Styling:** Tailwind CSS
      30 * **Authentication UI:** Better Auth
      31 * **HTTP Client:** Axios
      32
      33 ### Backend (Server-Side)
      34 * **Framework:** FastAPI (Python 3.13+)
      35 * **Database ORM:** SQLModel
      36 * **Database:** PostgreSQL (e.g., Neon DB)
      37 * **Authentication Logic:** JWT-based Authentication
      38 * **AI Integration:** OpenAI API (for Conversational AI Assistant)
      39
      40 ### Infrastructure & Deployment
      41 * **Frontend Hosting:** Vercel
      42 * **Backend Hosting:** Vercel / Railway / Render
      43 * **CI/CD:** Automated scripts (`deploy_complete_app.sh`), Vercel CLI
      44
      45 ---
      46
      47 ## 3. Core Modules & Features
      48
      49 ### 3.1. Secure Authentication & Identity Management
      50 * **Implementation:** JWT-based authentication using Better Auth.
      51 * **Security:** Cryptographic validation and session encryption using
         `BETTER_AUTH_SECRET`.
      52 * **Features:** Secure Sign-in/Sign-up flows, persistent session
         verification, and a dedicated Account Security dashboard for seamless
         profile synchronization.
      53
      54 ### 3.2. Dynamic Task Management Engine
      55 * **Implementation:** Highly interactive React components.
      56 * **Features:** Visual task boards, intelligent sorting, dynamic
         filtering, and priority indicators (High, Medium, Low). 
      57 * **Data Flow:** Real-time updates via RESTful API calls to the FastAPI
         backend.
      58
      59 ### 3.3. Detailed Task Specifications & Collaboration
      60 * **Implementation:** Rich-text editors and hierarchical relational data
         models via SQLModel.
      61 * **Features:** Deep context tracking, sub-task structures, and detailed
         specification views. Eliminates scattered communication by keeping all
         requirements and updates in a centralized view.
      62
      63 ### 3.4. AI-Powered Conversational Assistant
      64 * **Implementation:** Integration of LLMs via backend routing.
      65 * **Features:** Natural language processing allowing users to query their
         schedule (e.g., "What tasks are due today?") and update statuses
         hands-free via an intuitive chat interface.
      66
      67 ### 3.5. Actionable Insights & Activity Tracking
      68 * **Implementation:** Comprehensive backend analytics engine tracking
         historical logs and status mutations.
      69 * **Features:** Activity timelines and performance metrics for managers to
         make data-driven decisions and optimize resource allocation.
      70
      71 ---
      72
      73 ## 4. Security & Data Flow
      74
      75 * **API Design:** The backend exposes a RESTful API via FastAPI,
         automatically generating OpenAPI (Swagger) documentation.
      76 * **CORS Configuration:** Strictly configured to allow cross-origin
         requests only from the Vercel-deployed frontend domain and local
         development environments.
      77 * **Environment Variables:** Critical secrets (like `BETTER_AUTH_SECRET`
         and database URIs) are securely injected via cloud environment variables.
      78 * **Validation:** SQLModel enforces strict schema validation and typing
         from the database layer directly to the API endpoints, preventing
      79   * **Containerization:** Docker ensures consistent runtime environments,
         isolating dependencies and ensuring secure execution across development
         and production.
      80  * **Cloud Hosting:** Hugging Face Spaces hosts the containerized FastAPI
         backend, providing robust infrastructure and seamless ML/AI integration
         capabilities.
      
