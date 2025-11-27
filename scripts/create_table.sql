SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- DOMAINS TABLE
-- ============================================================
CREATE TABLE domains (
    id BIGINT PRIMARY KEY,
    program VARCHAR(255),
    batch VARCHAR(255),
    capacity INT,
    qualification VARCHAR(255)
);


-- ============================================================
-- ORGANISATION TABLE
-- ============================================================
CREATE TABLE organisation (
    id BIGINT PRIMARY KEY,
    org VARCHAR(255) UNIQUE,
    address VARCHAR(255)
);


-- ============================================================
-- SPECIALISATION TABLE
-- ============================================================
CREATE TABLE specialisation (
    id BIGINT PRIMARY KEY,
    code VARCHAR(255),
    name VARCHAR(255),
    description TEXT,
    credits_req DOUBLE,
    year VARCHAR(255)
);


-- ============================================================
-- PLACEMENT TABLE
-- ============================================================
CREATE TABLE placement (
    id BIGINT PRIMARY KEY,
    org BIGINT,
    profile VARCHAR(255),
    description TEXT,
    intake INT,
    min_grade DOUBLE,
    ctc DOUBLE,
    CONSTRAINT fk_placement_org FOREIGN KEY (org) REFERENCES organisation(id)
);


-- ============================================================
-- STUDENTS TABLE
-- ============================================================
CREATE TABLE students (
    id BIGINT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    rollno VARCHAR(255) UNIQUE NOT NULL,
    cgpa INT,
    graduation_year INT,
    total_credits DOUBLE,
    org BIGINT,
    domain BIGINT,
    specialisation BIGINT,
    place_id BIGINT,
    photo_path VARCHAR(255),
    
    CONSTRAINT fk_student_org FOREIGN KEY (org) REFERENCES organisation(id),
    CONSTRAINT fk_student_domain FOREIGN KEY (domain) REFERENCES domains(id),
    CONSTRAINT fk_student_specialisation FOREIGN KEY (specialisation) REFERENCES specialisation(id),
    CONSTRAINT fk_student_placement FOREIGN KEY (place_id) REFERENCES placement(id)
);


-- ============================================================
-- EMPLOYEE TABLE
-- ============================================================
CREATE TABLE employee (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    title VARCHAR(255),
    photograph_path VARCHAR(255),
    department VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
);


-- ============================================================
-- PLACEMENT FILTER TABLE
-- ============================================================
CREATE TABLE placement_filter (
    id BIGINT PRIMARY KEY,
    place_id BIGINT,
    specialisation BIGINT,
    domain BIGINT,
    
    CONSTRAINT fk_pf_place FOREIGN KEY (place_id) REFERENCES placement(id),
    CONSTRAINT fk_pf_specialisation FOREIGN KEY (specialisation) REFERENCES specialisation(id),
    CONSTRAINT fk_pf_domain FOREIGN KEY (domain) REFERENCES domains(id)
);


-- ============================================================
-- PLACEMENT STUDENT TABLE
-- ============================================================
CREATE TABLE placement_student (
    id BIGINT PRIMARY KEY,
    place_id BIGINT,
    sid BIGINT,
    cv_app VARCHAR(255),
    about TEXT,
    acceptance VARCHAR(255),
    comments TEXT,
    date DATE,
    
    CONSTRAINT fk_ps_place FOREIGN KEY (place_id) REFERENCES placement(id),
    CONSTRAINT fk_ps_student FOREIGN KEY (sid) REFERENCES students(id)
);

SET FOREIGN_KEY_CHECKS = 1;

