'use strict'

const controls = require('./validators');

function missing(name) {
    return "Error: missing required field "+name;
}

function invalid(name) {
    return "Error: invalid "+name+" format";
}

function badtype(name, goodtype) {
    return "Error: "+name+" should be a "+goodtype;
}

function badrange(name, range) {
    return "Error: "+name+" values should in the range "+range;
}

module.exports = {
    customerPostController: (data) => {
        const errors = [];

        // check the email data
        if (!data.email | data.email === "") {
            errors.push(missing("E-MAIL ADDRESS"));
        } else if (controls.isEmail(data.email) === false) {
            errors.push(invalid("E-MAIL ADDRESS"));
        } 

        // check the name field
        if (!data.name | data.name === "") {
            errors.push(missing("NAME"));
        }
        
        // send back result
        return errors.length != 0 ? errors : "";
    },

    customerPutController: (id, data) => {
        const errors = [];

        // check the name field
        if (!data.name | data.name === "") {
            errors.push(missing("NAME"));
        }

        // check if the id is numeric
        if (isNaN(id)) {
            errors.push(badtype("ID", "number"));
        }

        // send back result
        return errors.length > 0 ? errors : "";
    },

    customerDeleteController: (id) => {
        const errors = [];
        
        // check if the id is numeric
        if (isNaN(id)) {
            errors.push(badtype("ID", "number"));
        }
        
        // send back result
        return errors.length > 0 ? errors : "";
    },

    reservationGetController: (data) => {
        const errors = [];
        
        // check starting date
        if (!data.from) {
            errors.push(missing("FROM DATE"));
        } else if (new Date(data.from).getTime() === NaN) {
            errors.push(badtype("FROM DATE", "valid date YYYY-MM-DD"));
        }
        
        // check ending date
        if (!data.to) {
            errors.push(missing("TO DATE"));
        } else if (new Date(data.to).getTime() === NaN) {
            errors.push(badtype("TO DATE", "valid date YYYY-MM-DD"));
        }

        // send back result
        return errors.length > 0 ? errors : "";
    },

    reservationPostController: (data) => {
        const errors = [];

        // check customer id
        if (!data.customer) {
            errors.push(missing("CUSTOMER ID"));
        }

        // check reservation date
        if(!data.date) {
            errors.push(missing("RESERVATION DATE"));
        } else if (new Date(data.date).getTime() === NaN) {
            errors.push(badtype("RESERVATION DATE", "valid date YYYY-MM-DD"));
        }

        // check seats number
        if(!data.nseats) {
            errors.push(missing("NUMBER OF SEATS"))
        } else if (isNaN(data.nseats)) {
            errors.push(badtype("NUMBER OF SEATS", "number"));
        } else if (data.nseats < 1 || data.nseats > 4) {
            errors.push(badrange("NUMBER OF SEATS", "1 - 4"));
        }

        // check time of reservation
        if(!data.time) {
            errors.push(missing("TIME ID"))
        } else if (isNaN(data.time)) {
            errors.push(badtype("TIME ID", "number"));
        } else if (data.time < 0 || data.time > 4) {
            errors.push(badrange("TIME ID", "0 - 4"));
        }

        // check table for reservation
        if(!data.table) {
            errors.push(missing("TABLE ID"))
        } else if (isNaN(data.table)) {
            errors.push(badtype("TABLE ID", "number"));
        } else if (data.table < 0 || data.table > 4) {
            errors.push(badrange("TABLE ID", "0 - 4"));
        }

        // send back result
        return errors.length > 0 ? errors : "";
    },

    reservationPutController: (id, data) => {
        const errors = [];

        // check for reservation ID
        if (!id) {
            errors.push(missing("RESERVATION ID"));
        } else if (isNaN(id)) {
            errors.push(badtype("RESERVATION ID", "number"));
        }

        // check seats number
        if(!data.newSeats) {
            errors.push(missing("NUMBER OF SEATS"))
        } else if (isNaN(data.newSeats)) {
            errors.push(badtype("NUMBER OF SEATS", "number"));
        } else if (data.newSeats < 1 || data.newSeats > 4) {
            errors.push(badrange("NUMBER OF SEATS", "1 - 4"));
        }

        // check customer ID
        if (!data.newCustomerID) {
            errors.push(missing("CUSTOMER ID"));
        } else if (isNaN(data.newCustomerID)) {
            errors.push(badtype("CUSTOMER ID", "number"));
        }

        // send back result
        return errors.length > 0 ? errors : "";
    },

    reservationDeleteController: (id) => {
        const errors = [];

        // check the ID
        if (!id) {
            errors.push(missing("RESERVATION ID"));
        } else if (isNaN(id)) {
            errors.push(badtype("RESERVATION ID", "number"));
        }

        // send back result
        return errors.length > 0 ? errors : "";
    }
}