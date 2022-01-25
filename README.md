# Restaurant-Server

This server is a REST API that use Postgresql to store data.
It store customers data (just name and e-mail address). The e-mail address have to be unique, so if trying to add a user with the same e-mail adress will trigger an error.

It also store reservations containing:
- booking date
- booking time
- number of seats
- table number
- customer id (to retrieve customer data).

If you want to try it you will need to configure the variables in the .env file and to create the database following the /src/db/database.sql structure.

I also made some tests (need to add more, one day...), you can activate tests on node start by setting the env variable NODE_ENV = test.

For front-end you can check the other repository called Restaurant-Client.
