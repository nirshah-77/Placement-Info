# ESD Mini Project

A web application built with a **Spring Boot** backend and a **React** frontend, using **MySQL** as the database.


---

## Features
- Feature 1: *[Employee Login with JWT authentication]*
- Feature 2: *[View list of all students]*
- Feature 3: *[Search feature]*

---

## Technologies Used
### Backend
- **Spring Boot** (Java)
- **MySQL** database
- JPA/Hibernate for ORM

### Frontend
- **React** (JavaScript)
- **Axios** for API calls
- React Router for navigation
- CSS/Styled Components/Bootstrap for styling


---

Backend Setup
Navigate to the backend directory:

Update the MySQL configuration in application.properties :

properties
spring.datasource.url=jdbc:mysql://localhost:3306/placement_db
spring.datasource.username=nir
spring.datasource.password=password
Build and run the backend application:

bash
./mvnw spring-boot:run
This will start the server on http://localhost:8080.

Frontend Setup
Navigate to the frontend directory:


Install dependencies:

bash
npm install
Update the API base URL in your frontend project (e.g., in src/config.js or .env):


bash
npm start
This will open the app in your browser at http://localhost:3000.

Project Description:
Placement History is a web application designed to streamline the process of tracking and analyzing student placement data. It allows employees in the outreach department to:

Log in securely and access placement records of students.
View comprehensive placement history for both placed and unplaced students.
Filter placement details based on parameters such as:
Organization
Year
Domain
