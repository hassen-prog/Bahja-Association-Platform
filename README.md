# Bahja Association Platform

A full-stack family support platform designed to help parents of children affected by cancer find useful resources, connect with other families, and access supportive activities in one place.

Built with **Angular**, **Spring Boot**, and **MySQL**, the platform combines a parent-facing portal with administrative tools for managing content and activities.

> **Project status:** Local development setup verified for the Angular frontend and Spring Boot backend. Deployment/demo links and screenshots can be added when available.

## Contents

- [Overview](#overview)
- [Features](#features)
- [Technology stack](#technology-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1-clone-the-repository](#1-clone-the-repository)
  - [2-configure-the-database-and-backend](#2-configure-the-database-and-backend)
  - [3-run-the-spring-boot-backend](#3-run-the-spring-boot-backend)
  - [4-run-the-angular-frontend](#4-run-the-angular-frontend)
- [Local URLs](#local-urls)
- [Configuration and security](#configuration-and-security)
- [Development notes](#development-notes)
- [Future improvements](#future-improvements)

## Overview

Bahja Association brings family support resources and community features together in a single web application. Parents can explore educational content, participate in community spaces, and access activities designed for children, while administrators can manage platform content and workflows.

The repository is organized as a single full-stack project:

- **Frontend:** Angular application
- **Backend:** Spring Boot REST API
- **Database:** MySQL

## Features

### Family and community support

- Parent community and forum for sharing information and experiences.
- Educational resources, including books and videos.
- Course and content detail views.
- Appointment and meeting management.

### Kids Corner

- Child-friendly activities and content.
- Interactive coloring activity.

### AI assistant

- Conversational assistant integrated into the application.
- Can be configured with an OpenRouter API key; keep the key in local environment configuration, never in source control.

### Administration

- Separate administrative area for managing platform features and content.
- Administrative views for appointments and chat-related workflows.

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | Angular, TypeScript, HTML, SCSS, Angular Material |
| Backend | Java 17, Spring Boot, Spring Data JPA, REST APIs |
| Database | MySQL |
| Build tools | npm, Maven Wrapper |
| Integrations | OpenRouter (optional AI assistant configuration) |

## Project structure

```text
Bahja-Association-Platform/
├── frontend/                  # Angular application
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── package-lock.json
├── backend/                   # Spring Boot application
│   ├── src/main/java/
│   ├── src/main/resources/
│   ├── .mvn/wrapper/
│   ├── mvnw
│   ├── mvnw.cmd
│   └── pom.xml
├── .gitignore
└── README.md
```

## Getting started

These instructions describe a local development setup. Run the backend and frontend in separate terminals.

### Prerequisites

Install the following tools before starting:

- **Java JDK 17**
- **MySQL Server**
- **Node.js and npm** (use a version compatible with the Angular dependencies in `frontend/package.json`)
- **Git**

Maven does not need to be installed separately because the backend includes the Maven Wrapper.

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/Bahja-Association-Platform.git
cd Bahja-Association-Platform
```

Replace `<your-username>` with the GitHub account that owns the repository.

### 2. Configure the database and backend

Start MySQL and create a database named `Bahja`, or use a MySQL account that has permission to create it.

Open `backend/src/main/resources/application.properties` and configure the database connection for your local environment. The project has been configured to use the following defaults:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/Bahja?createDatabaseIfNotExist=true&useUnicode=true
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:}
spring.jpa.hibernate.ddl-auto=update
server.port=8086
```

If you prefer a different MySQL username or password, set `DB_USERNAME` and `DB_PASSWORD` in your environment or update your **local, uncommitted** configuration. Do not commit real passwords or API keys.

If your local `application.properties` has not yet been changed to use environment variables, make that change before sharing the repository. Configure mail and AI credentials through environment variables when those features are needed:

```properties
spring.mail.username=${MAIL_USERNAME:}
spring.mail.password=${MAIL_PASSWORD:}
openrouter.api.key=${OPENROUTER_API_KEY:}
```

Provide these values in your local environment if you want email delivery or the AI assistant to work. They are optional for starting the application only if the code does not require them during startup.

### 3. Run the Spring Boot backend

From the repository root:

**Git Bash / macOS / Linux**

```bash
cd backend
./mvnw spring-boot:run
```

**Windows PowerShell**

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The API is configured to run on **port `8086`**. Keep this terminal open while using the frontend. On first run, Maven may need to download dependencies.

### 4. Run the Angular frontend

Open a second terminal from the repository root:

```bash
cd frontend
npm install
npm start
```

If the `start` script is unavailable, check the scripts in `frontend/package.json` and use the project's Angular CLI script (commonly `npx ng serve`).

Open the local URL printed by Angular in the terminal; the default Angular development URL is commonly `http://localhost:4200`.

## Local URLs

| Service | Local address |
| --- | --- |
| Angular frontend | `http://localhost:4200` (default; confirm the URL printed by Angular) |
| Spring Boot backend | `http://localhost:8086` |
| Frontend parent portal | `/front` route, if configured in the current frontend build |
| Frontend administration area | `/admin` route, if configured in the current frontend build |

A `404` at the backend root (`http://localhost:8086/`) does not by itself mean the backend failed to start; the root path may not have a controller mapped to it.

## Configuration and security

- **Never commit secrets.** Keep database passwords, mail credentials, API keys, and private tokens out of source files and Git history.
- Use environment variables or an untracked local configuration file for local credentials.
- Rotate any credentials that have been accidentally exposed, then update your local environment with the replacements.
- Do not commit `node_modules/`, Angular build output, Maven `target/`, runtime uploads, local `.env` files, or archive backups.
- `spring.jpa.hibernate.ddl-auto=update` allows Hibernate to update the schema during development. Review database migration and schema-management requirements before deploying to production.
- Email and AI integrations require valid local configuration and access to their respective services.

## Development notes

- Start the backend before testing frontend features that call the API.
- If API calls fail, verify that MySQL is running, the backend is listening on port `8086`, and the Angular application's API base URL points to the local backend.
- Authentication, CORS, and API security settings are managed in the Spring Boot backend; use the browser developer tools and backend logs when diagnosing connection issues.
- Uploaded files are runtime data. Keep private uploads out of version control and use sample assets for public demonstrations.

## Future improvements

- Add screenshots of the family portal, administrator area, and Kids Corner.
- Add a short demo video and/or a hosted demo link.
- Document the main REST API endpoints and authentication flow.
- Add automated build and test workflows for the frontend and backend.

---

Made as a full-stack family support platform using Angular and Spring Boot.
