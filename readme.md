# ESD Mini Project

This repository contains a complete **Placement History Viewer**, including a **Java Spring Boot** backend and a **React**-based frontend.

## 📂 Folder Structure

### 1. *backend* (Spring Boot)
- Built with **Java Spring Boot**.
- Handles all the business logic, API endpoints, and database connectivity.
- Includes:
  - Configuration files.
  - Controllers, Services, and Repositories for placement management.

### 2. *resources* (SQL Scripts)
- Contains the SQL files required to set up the database.

### 3. *frontend* (React)
- Built with **React**.
- Provides a user interface for interacting with the backend API.
- Includes components for managing placements, students, and search filters.
## 🛠️ Technologies Used
- **Backend**: Java Spring Boot, MySQL.
- **Frontend**: React, HTML/CSS, JavaScript.
- **Database**: MySQL (with .sql scripts for setup).

---
---

## 📄 Environment Variable Details

| Variable Name                          | Description                           | Default Value                |
|----------------------------------------|---------------------------------------|------------------------------|
| SPRING_DATASOURCE_URL                | JDBC URL for the database             | jdbc:mysql://localhost:3306/placement_db |
| SPRING_DATASOURCE_USERNAME           | Database username                     | nir               |
| SPRING_DATASOURCE_PASSWORD           | Database password                     | password             |
| SPRING_DATASOURCE_DRIVER_CLASS_NAME  | Database driver class name            | com.mysql.cj.jdbc.Driver |
| SPRING_JPA_HIBERNATE_DDL_AUTO        | Hibernate schema management strategy  | update                    |
| SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT | Hibernate dialect                   | org.hibernate.dialect.MySQL5Dialect |
| SPRING_JPA_SHOW_SQL                  | Show SQL queries in logs              | true                      |
| SPRING_JPA_PROPERTIES_HIBERNATE_FORMAT_SQL | Format SQL queries in logs        | true                      |

---
