"use strict";

/* Get HTTP server object */
const server = require('./http');

/* Set timezone to UTC */
process.env.TZ = 'UTC';

/* Activate http server listen */
server.listen(parseInt(process.env.PORT, 10) | 5000);

/* Display starting message */
console.log("Now starting http server on port " + (parseInt(process.env.PORT, 10) | 5000).toString() + ".");