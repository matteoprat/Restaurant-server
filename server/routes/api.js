'use strict';

const reservations = require('../db/reservations_queries');
const customers = require('../db/customers_queries');
const checkInput = require("../libs/controller");

module.exports = function (app) {
    // CUSTOMER RELATED 

    app.route('/api/customer')
    .get(async (req, res) => {
        try {
            const message = await customers.handleGet();
            res.status(200).send({result: message});
        } catch (err) {
            console.error(err.message);
            res.status(500).send({result: {message: ['An error occurred']}});
        }
    })
    .post(async (req, res) => {
        try {
            const result = {message: checkInput.customerPostController(req.body)}
            
            if (result.message !== "") {
                res.status(400).send(result);
            } else {
                const reply = await customers.handlePost(req.body);
                res.status(201).send(reply);
            }
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send({result: {message: ['An error occurred']}});
        }
    })
    
    app.route('/api/customer/:id')
    .put(async (req, res) => {
        try {
            const result = { message: checkInput.customerPutController(req.params.id, req.body) }
            
            if (result.message !== "") {
                res.status(400).send(result);
            } else {
                const reply = await customers.handlePut(req.params.id, req.body.name);
                if (reply.message !== "Success") { // the user is checked in handlePut so have to check if there is an error
                    res.status(400).send(reply);
                } else {
                    // I could put code 204 but I need to send back data and 204 does not allow body
                    res.status(200).send(reply);
                }
            }

        } catch (err) {
            console.error(err.message);
            res.status(500).send({result: {message: ['An error occurred']}});
        }
        
    })
    .delete(async (req, res) => {
        try {
            const result = { message: checkInput.customerDeleteController(req.params.id) }
            
            if (result.message !== "") {
                res.status(400).send(result);
            } else {
                const reply = await customers.handleDelete(req.params.id);
                if (reply.message !== "Success") {
                    res.status(400).send(reply);
                } else {
                    res.status(200).send(reply);
                }
            }
    
        } catch (err) {
            console.error(err.message);
            res.status(500).send({result: {message: ['An error occurred']}});
        }
        
    });
    // RESERVATIONS RELATED
    app.route('/api/reservations')
    .get(async (req, res) => {
        try {
            const result = {message: checkInput.reservationGetController(req.query)};
            
            if (result.message !== "") {
                res.status(400).send(result);
            } else {
                const reply = await reservations.handleGet(req.query.from, req.query.to);
                res.status(200).send(reply);
            }

        } catch (err) {
            console.error(err.message);
            res.status(500).send({result: {message: ['An error occurred']}});
        }
    })
    .post(async (req, res) => {
        try {
            const reservationData = req.body;
            const result = {message: checkInput.reservationPostController(req.body)};
            
            if (result.message !== "") {
                res.status(400).send(result);
            } else {
                const reply = await reservations.handlePost(reservationData);
                if (reply.message !== "Success") {
                    res.status(400).send(reply);
                } else {
                    res.status(201).send(reply);
                }
            }

        } catch (err) {
            console.error(err.message);
            res.status(500).send({result: {message: ['An error occurred']}});
        }
    })

    app.route("/api/reservations/:id")
    .put(async (req, res) => {
        try {
            const id = req.params.id;
            const data = req.body;
            
            const result = {message: checkInput.reservationPutController(id, data)};
            
            if (result.message !== "") {
                res.status(400).send(result);
            } else {
                const reply = await reservations.handlePut(id, data);
                if (reply.message !== "Success") {
                    res.status(400).send(reply);    
                } else {
                    res.status(200).send(reply);
                }
            }

        } catch (err) {
            console.error(err.message);
            res.status(500).send({result: {message: ['An error occurred']}});
        }
    })
    .delete(async (req, res) => {
        try {
            const result = {message: checkInput.reservationDeleteController(req.params.id)};
            if (result.message !== "") {
                res.status(400).send(result);
            } else {
                const reply = await reservations.handleDelete(req.params.id);
                if (reply.message !== "Success") {
                    res.status(400).send(reply);
                } else {
                    res.status(200).send(reply);
                }
            }
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send({result: {message: ['An error occurred']}});
        }
    });
}