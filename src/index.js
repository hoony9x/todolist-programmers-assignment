"use strict";

const server = require('./http');

/* Set timezone to UTC */
process.env.TZ = 'UTC';

/* Activate http server listen */
server.listen(parseInt(process.env.PORT, 10) | 5000);