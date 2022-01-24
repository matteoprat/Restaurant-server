'use strict';

const reservations = require('../db/reservations_queries');
const customers = require('../db/customers_queries');
const checkInput = require("../libs/controller");

module.exports = function (app) {
    app.route('/api/customer')
    .get(async (req, res) => {
        try {
            const message = await customers.handleGet();
            res.send({result: message});
        } catch (err) {
            console.error(err.message);
        }
    })
    .post(async (req, res) => {
        try {
            let result = {message: checkInput.customerPostController(req.body)}
            
            if (result.message === "") {
                result = await customers.handlePost(req.body);
            }
            
            res.send(result);
        } catch (err) {
            console.error(err.message);
        }
    })
    
    app.route('/api/customer/:id')
    .put(async (req, res) => {
        try {
            let result = { message: checkInput.customerPutController(req.params.id, req.body) }
                
            if (result.message === "") {
                result = await customers.handlePut(req.params.id, req.body.name);
            }

            res.send(result);
        } catch (err) {
            console.error(err.message);
        }
        
    })
    .delete(async (req, res) => {
        try {
            let result = { message: checkInput.customerDeleteController(req.params.id) }
            
            if (result.message === "") {
                result = await customers.handleDelete(req.params.id);
            }
    
            res.send(result);
        } catch (err) {
            console.error(err.message);
        }
        
    });

    app.route('/api/reservations')
    .get(async (req, res) => {
        try {
            let result = {message: checkInput.reservationGetController(req.query)};
            
            if (result.message === "") {
                result = await reservations.handleGet(req.query.from, req.query.to);
            }

            res.send(result);
        } catch (err) {
            console.error(err.message);
        }
    })
    .post(async (req, res) => {
        try {
            const reservationData = req.body;
            
            let result = {message: checkInput.reservationPostController(req.body)};
            
            if (result.message === "") {
                result = await reservations.handlePost(reservationData);
            }

            res.send(result);
        } catch (err) {
            console.error(err.message);
        }
    })

    app.route("/api/reservations/:id")
    .put(async (req, res) => {
        try {
            let id = req.params.id;
            let data = req.body;
            
            let result = {message: checkInput.reservationPutController(id, data)};
            
            if (result.message === "") {
                result = await reservations.handlePut(id, data);
            }

            res.send(result);
        } catch (err) {
            console.error(err.message);
        }
    })
    .delete(async (req, res) => {
        try {
            let result = {message: checkInput.reservationDeleteController(req.params.id)};
            if (result.message === "") {
                result = await reservations.handleDelete(req.params.id);
            }
            res.send(result);
        } catch (err) {
            console.error(err.message);
        }
    });
}