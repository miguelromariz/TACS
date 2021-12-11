--drop
DROP TABLE IF EXISTS Patient;
DROP TABLE IF EXISTS Doctor;
--drop
CREATE TABLE Patient(
id SERIAL PRIMARY KEY,
name TEXT,
age TEXT,
doctors TEXT,
turtle TEXT
);
CREATE TABLE Doctor(
id SERIAL PRIMARY KEY,
name TEXT,
age TEXT
);
