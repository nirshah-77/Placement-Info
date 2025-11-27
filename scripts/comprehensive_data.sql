-- Comprehensive Data Population Script
-- This script populates all tables with at least 10 diverse records

-- Clear existing data (in correct order to respect foreign keys)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE placement_student;
TRUNCATE TABLE students;
TRUNCATE TABLE placement;
TRUNCATE TABLE organisation;
TRUNCATE TABLE specialisation;
TRUNCATE TABLE domains;
TRUNCATE TABLE departments;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert Departments (10 records)
INSERT INTO departments (id, name, capacity) VALUES
(1, 'Computer Science', 120),
(2, 'Electronics', 100),
(3, 'Mathematics', 80),
(4, 'Physics', 70),
(5, 'Data Science', 90),
(6, 'Artificial Intelligence', 85),
(7, 'Cybersecurity', 75),
(8, 'Mechanical Engineering', 95),
(9, 'Civil Engineering', 88),
(10, 'Chemical Engineering', 82);

-- Insert Domains (10 records)
INSERT INTO domains (id, program, batch) VALUES
(1, 'B.Tech', '2020-2024'),
(2, 'M.Tech', '2022-2024'),
(3, 'B.Tech', '2021-2025'),
(4, 'M.Tech', '2023-2025'),
(5, 'B.Sc', '2020-2023'),
(6, 'M.Sc', '2022-2024'),
(7, 'B.Tech', '2019-2023'),
(8, 'M.Tech', '2021-2023'),
(9, 'PhD', '2020-2025'),
(10, 'B.Tech', '2022-2026');

-- Insert Specialisation (10 records)
INSERT INTO specialisation (id, code, name, description, credits_req, year) VALUES
(1, 'CS101', 'Machine Learning', 'Advanced ML techniques', 24, 2024),
(2, 'EC201', 'VLSI Design', 'Chip design and fabrication', 22, 2024),
(3, 'MA301', 'Applied Mathematics', 'Real-world math applications', 20, 2024),
(4, 'DS401', 'Big Data Analytics', 'Large-scale data processing', 26, 2024),
(5, 'AI501', 'Deep Learning', 'Neural networks and AI', 28, 2024),
(6, 'CY601', 'Network Security', 'Cybersecurity fundamentals', 24, 2024),
(7, 'CS701', 'Cloud Computing', 'Distributed systems', 22, 2024),
(8, 'DS801', 'Data Mining', 'Pattern recognition', 20, 2024),
(9, 'AI901', 'Computer Vision', 'Image processing and AI', 26, 2024),
(10, 'CS1001', 'Blockchain', 'Distributed ledger technology', 24, 2024);

-- Insert Organisation (15 records)
INSERT INTO organisation (id, org, address) VALUES
(1, 'Google', 'Mountain View, CA'),
(2, 'Microsoft', 'Redmond, WA'),
(3, 'Amazon', 'Seattle, WA'),
(4, 'Apple', 'Cupertino, CA'),
(5, 'Meta', 'Menlo Park, CA'),
(6, 'Netflix', 'Los Gatos, CA'),
(7, 'Tesla', 'Palo Alto, CA'),
(8, 'IBM', 'Armonk, NY'),
(9, 'Oracle', 'Austin, TX'),
(10, 'Adobe', 'San Jose, CA'),
(11, 'Salesforce', 'San Francisco, CA'),
(12, 'Intel', 'Santa Clara, CA'),
(13, 'NVIDIA', 'Santa Clara, CA'),
(14, 'Cisco', 'San Jose, CA'),
(15, 'SAP', 'Walldorf, Germany');

-- Insert Placement (15 records)
INSERT INTO placement (id, org, profile, description, intake, min_grade, ctc) VALUES
(1, 'Google', 'Software Engineer', 'Full-stack development', 10, 8.0, 24.5),
(2, 'Microsoft', 'Cloud Engineer', 'Azure development', 8, 7.5, 22.0),
(3, 'Amazon', 'SDE-1', 'Backend development', 12, 7.8, 18.5),
(4, 'Apple', 'iOS Developer', 'Mobile app development', 6, 8.2, 20.0),
(5, 'Meta', 'Data Scientist', 'ML and analytics', 7, 8.5, 25.0),
(6, 'Netflix', 'DevOps Engineer', 'Infrastructure automation', 5, 7.9, 28.0),
(7, 'Tesla', 'AI Engineer', 'Autonomous systems', 4, 8.7, 21.5),
(8, 'IBM', 'Consultant', 'Enterprise solutions', 10, 7.0, 12.0),
(9, 'Oracle', 'Database Developer', 'Database management', 8, 7.3, 14.5),
(10, 'Adobe', 'UI/UX Designer', 'Creative design', 6, 7.5, 16.0),
(11, 'Salesforce', 'CRM Developer', 'Salesforce platform', 9, 7.6, 15.5),
(12, 'Intel', 'Hardware Engineer', 'Chip design', 7, 8.0, 13.5),
(13, 'NVIDIA', 'GPU Engineer', 'Graphics processing', 5, 8.4, 19.0),
(14, 'Cisco', 'Network Engineer', 'Network infrastructure', 8, 7.4, 11.0),
(15, 'SAP', 'ERP Consultant', 'Business solutions', 10, 7.2, 10.5);

-- Insert Placement_Filter (15 records)
INSERT INTO placement_filter (id, place_id, specialisation, domain) VALUES
(1, 1, 1, 1),
(2, 2, 1, 1),
(3, 3, 1, 1),
(4, 4, 1, 1),
(5, 5, 4, 5),
(6, 6, 6, 7),
(7, 7, 5, 6),
(8, 8, 1, 1),
(9, 9, 2, 2),
(10, 10, 8, 5),
(11, 11, 1, 1),
(12, 12, 2, 2),
(13, 13, 9, 6),
(14, 14, 2, 2),
(15, 15, 4, 5);

