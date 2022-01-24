'use strict';

const pool = require('./db');

module.exports = {
    handleGet: async() => {
        // send user data to viewer
        const ans = await pool.query("SELECT * FROM customer ORDER BY email");
        return ans.rows;
    },
    handlePost: async(customerData) => {
        // insert data into db - check if email exists
        // the received data has been processed before
        const ans = await pool.query("SELECT id FROM customer WHERE email = $1", [customerData.email]);
        if (ans.rows[0]) {
            return {message: ["Error: a user with the same email is already in the database"]};
        } else {
            const write = await pool.query("INSERT INTO customer (name, email) VALUES ($1, $2) RETURNING *" , [customerData.name, customerData.email]);
            return {message: "Success", data: write.rows[0]};
        }
    },
    handlePut: async(customerID, customerName) => {
        // edit customer data - check if email exists
        const ans = await pool.query("SELECT id FROM customer WHERE id = $1", [customerID]);
        if (!ans.rows[0]) {
            return {message: ["Error: this user is not in our database"]};
        } else {
            const update = await pool.query("UPDATE customer SET name = $1 WHERE id=$2 RETURNING *" , [customerName, customerID]);
            return {message: "Success", data:update.rows[0]};
        }
    },
    handleDelete: async(customerID) => {
        // delete customer data and its reservations
        const ans = await pool.query("SELECT id FROM customer WHERE id = $1", [customerID]);
        if (!ans.rows[0]) {
            return {message: ["Error: this user is not in our database"]};
        } else {
            // delete customer data
            await pool.query("DELETE FROM customer WHERE id = $1", [customerID]);
            // delete customer reservations
            await pool.query("DELETE FROM reservation WHERE customer_id = $1", [customerID]);
            return {message: "Success"};
        }
    }
};