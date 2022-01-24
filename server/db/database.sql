CREATE DATABASE reservations
    WITH
    ENCODING = 'UTF-8'
    CONNECTION LIMIT = -1;

CREATE TABLE reservation(
    id SERIAL PRIMARY KEY,
    customer_id INTEGER,
    booking_date DATE,
    booking_table SMALLINT,
    booking_time SMALLINT,
    booked_seats SMALLINT
);

CREATE TABLE customer(
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255)
);