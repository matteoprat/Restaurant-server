'use strict';

const pool = require('./db');

module.exports = {
    handleGet: async(startDate, endDate) => {
        // it will return reservations for given interval
        try {
            const response = await pool.query("SELECT reservation.id, to_char(reservation.booking_date,'YYYY-MM-DD') AS booking_date, reservation.booking_table, reservation.booking_time, reservation.booked_seats, customer.name, customer.email FROM reservation INNER JOIN customer ON (reservation.customer_id = customer.id) WHERE reservation.booking_date >= $1 AND reservation.booking_date <= $2 ORDER BY reservation.booking_date, reservation.booking_time, reservation.booking_table", [startDate, endDate]);
            return {message: "Success", data: response.rows};
        } catch (err) {
            console.error(err.message);
            return {message: ["An error occurred while trying to retrieve reservations from database"]}            
        }
    },
    handlePost: async(reservationData) => {
        // add a reservation to db - check if customer exists first
        try {
            // check the user
            const userData = await pool.query("SELECT * FROM customer WHERE id = $1", [reservationData.customer]);
            if (!userData.rows[0]) {
                return {message: ["Error: the user you try to reserve the table for does not exists"]};
            } else {
                // check if there is a reservation for the same day at the same time at the same hour
                const alreadyReserved = await pool.query("SELECT id FROM reservation WHERE booking_date = $1 AND booking_table = $2 AND booking_time = $3", [reservationData.date, reservationData.table, reservationData.time]);
                if (alreadyReserved.rows[0]) {
                    return { message: ["Error: a reservation for the same time/day/table already exists"]};
                } else {
                    // here I can insert data inside the database
                    const writeData = await pool.query("INSERT INTO reservation (booking_date, booking_table, booking_time, booked_seats, customer_id) VALUES ($1, $2, $3, $4, $5) RETURNING *", [reservationData.date, reservationData.table, reservationData.time, reservationData.nseats, reservationData.customer]);
                    return {message: "Success", data: writeData.rows[0]};
                }
            }
        } catch (err) {
            console.error(err.message); 
            return {message: ["An error occurred while trying to record data"]};         
        }
    },
    handlePut: async(id, data) => {
        // edit a reservation - change the customer id, if customer exists
        // check the reservation
        try {
            const reservation = await pool.query("SELECT * FROM reservation WHERE id = $1", [id]);
            if (!reservation.rows[0]) {
                return {message: ["Error: no such reservation in our database"]};
            }       
            // check the customer
            const userData = await pool.query("SELECT * FROM customer WHERE id = $1", [data.newCustomerID]);
            if (!userData.rows[0]) {
                return {message: ["Error: the user you try to reserve the table for does not exists"]};
            } else {
                const updateData = await pool.query("UPDATE reservation SET customer_id=$1, booked_seats=$2 WHERE id = $3 RETURNING *",[data.newCustomerID, data.newSeats, id]);
                return {message: "Success", data: updateData.rows[0]};
            }
        } catch (err) {
            console.error(err.message);
            return {message: ["An error occured while trying to update the reservation"]};
        }
    },
    handleDelete: async(id) => {
        // delete a reservation
        // check if reservation exists
        try {
            const reservation = await pool.query("SELECT * FROM reservation WHERE id = $1", [id]);
            if (!reservation.rows[0]) {
                return {message: ["Error: no such reservation in our database"]};
            } else {
                await pool.query("DELETE FROM reservation WHERE id=$1", [id]);
                return {message: "Success"};
            }    
        } catch (err) {
            console.error(err.message);
            return {message: ["An error occurred while trying to delete the reservation"]}
        }
    }
};