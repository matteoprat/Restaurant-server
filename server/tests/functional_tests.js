const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../index');
const dbTests = require('../db/db-tests');

chai.use(chaiHttp);

suite('Functionl Tests', async () => {

    // PART I: TESTING CORRECT DATA PASSED TO CUSTOMER

    await test("#1 - GET request to retrieve customers", async function() {
        chai.request(server)
        .get('/api/customer/')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body.result, "Data should be returned inside array");
        });
    });

    await test("#2 - POST request handle valid insert into customers", async function() {
        await dbTests.deleteTitar();
        chai.request(server)
        .post('/api/customer/')
        .send({name: "John Titar", email: "emailfromfuture@damain.ed"})
        .end(function(err, res){
          assert.equal(res.status, 201);
          assert.equal(res.body.message, "Success", "no problem reported");
          assert.isObject(res.body.data, "Data should be returned inside an object");
          assert.equal(res.body.data.name, "John Titar", "The name should be inserted correctly");
          assert.equal(res.body.data.email, "emailfromfuture@damain.ed", "The email should be the same as the one provided");
        });
    });
    
    await test('#3 - PUT request handle valid customer id', async function() {  
      var fakeID =  await dbTests.fakeCustomer();
      chai.request(server)
        .put('/api/customer/'+fakeID)
        .send({name: "John TitOr"})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.message, "Success", "no problem reported");
          assert.isObject(res.body.data, "Data should be returned inside array");
          assert.equal(res.body.data.name, "John TitOr", "The name should be inserted correctly");
        });
    });
    
    await test('#4 - DELETE request handle valid customer id', async function() {
      var fakeID =  await dbTests.getFakeCustomer();
      chai.request(server)
        .delete('/api/customer/'+fakeID)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.message, "Success", "no problem reported");
        });
    });

    // PART II: TESTING ERROR REPORTINGS FOR INVALID OR MISSING DATA IN CUSTOMER

    await test("#5 - POST request invalid email type to customers", async function() {
      chai.request(server)
      .post('/api/customer/')
      .send({name: "John Titar", email: "emailfromfuturedamain.ed"})
      .end(function(err, res){
        assert.equal(res.status, 400);
        assert.equal(res.body.message[0], "Error: invalid E-MAIL ADDRESS format", "email format error should be reported");
      });
    });

    await test("#6 - POST request missing email field to customer", async function() {
      chai.request(server)
      .post('/api/customer/')
      .send({name: "John Titar"})
      .end(function(err, res){
        assert.equal(res.status, 400);
        assert.equal(res.body.message[0], "Error: missing required field E-MAIL ADDRESS", "missing email error should be reported");
      });
    });

    await test("#7 - POST request empty email field to customer", async function() {
      chai.request(server)
      .post('/api/customer/')
      .send({name: "John Titar", email: ""})
      .end(function(err, res){
        assert.equal(res.status, 400);
        assert.equal(res.body.message[0], "Error: missing required field E-MAIL ADDRESS", "missing email error should be reported");
      });
    });

    await test("#8 - POST request missing name field to customer", async function() {
      chai.request(server)
      .post('/api/customer/')
      .send({email: "johntitor@future.com"})
      .end(function(err, res){
        assert.equal(res.status, 400);
        assert.equal(res.body.message[0], "Error: missing required field NAME", "missing name error should be reported");
      });
    });

    await test("#9 - POST request empty name field to customer", async function() {
      chai.request(server)
      .post('/api/customer/')
      .send({name: "", email: "johntitor@future.com"})
      .end(function(err, res){
        assert.equal(res.status, 400);
        assert.equal(res.body.message[0], "Error: missing required field NAME", "missing name error should be reported");
      });
    });
    
    await test('#10 - PUT request handle invalid id type', async function() {  
      chai.request(server)
        .put('/api/customer/string')
        .send({name: "John TitOr"})
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.body.message[0], "Error: ID should be a number", "invalid ID type should be reported");
        });
    }); 

    await test('#11 - PUT request handle missing name field', async function() {  
      chai.request(server)
        .put('/api/customer/8')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.body.message[0], "Error: missing required field NAME", "missing name error should be reported");
        });
    }); 

    await test('#12 - PUT request handle empty name field', async function() {  
      chai.request(server)
        .put('/api/customer/8')
        .send({name: ""})
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.body.message[0], "Error: missing required field NAME", "missing name error should be reported");
        });
    }); 

    await test('#13 - DELETE request bad ID type', async function() {  
      chai.request(server)
        .delete('/api/customer/string')
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.body.message[0], "Error: ID should be a number", "wrong ID type should be reported");
        });
    }); 

    await test('#14 - POST duplicate element E-MAIL', async function() {
      let id = await dbTests.fakeCustomer2();
      chai.request(server)
        .post('/api/customer/')
        .send({name: "Pippo", email: "123456789@567.ed"})
        .end(async function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.body.message[0], "Error: a user with the same email is already in the database", "duplicate email address should be reported");
          await dbTests.deleteCustomer(id);
        });
    }); 

    await test('#15 - DELETE non existing ID', async function() {  
      chai.request(server)
        .delete('/api/customer/10045878')
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.body.message[0], "Error: this user is not in our database", "wrong ID type should be reported");
        });
    }); 

    await test('#16 - PUT non existing ID', async function() {  
      chai.request(server)
        .put('/api/customer/10045878')
        .send({name: "Stallman"})
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.body.message[0], "Error: this user is not in our database", "wrong ID type should be reported");
        });
    }); 

    // PART III: TESTING CORRECT DATA PASSED TO RESERVATION
    
});