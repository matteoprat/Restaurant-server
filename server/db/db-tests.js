const pool = require('./db');

var id = -1;

module.exports = {
    deleteTitar: async () => {
        await pool.query("DELETE FROM customer WHERE email = $1", ["emailfromfuture@damain.ed"]);
    },

    fakeCustomer: async () => {
        try {
            data = await pool.query("INSERT INTO customer (name, email) VALUES ($1,$2) RETURNING *", ["Stallman", "futurepast@wow.ed"]);
            id = data.rows[0].id;
            return id;    
        } catch (err) {
            console.error(err.message);
        }
    },

    getFakeCustomer: async () => {
        return id;
    },

    fakeCustomer2: async () => {
        data = await pool.query("INSERT INTO customer (name, email) VALUES ($1,$2) RETURNING *", ["Stallman", "123456789@567.ed"]);
        id = data.rows[0].id;
        return id;    
    },

    deleteCustomer: async (id) => {
        await pool.query("DELETE FROM customer WHERE id = $1", [id]);
    }
}