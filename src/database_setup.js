"use strict";

const mysql = require('mysql2/promise');

(async() => {
  try {
    const db_connection = await mysql.createConnection({
      host: process.env.MYSQL_ROOT_HOST || "mysql-server",
      database: process.env.MYSQL_DATABASE || "my_database",
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_ROOT_PASSWORD || "password"
    });

    // Create `todos` table
    const todos_create_query = "CREATE TABLE IF NOT EXISTS `todos` (\n" +
      "  `id` int(11) NOT NULL AUTO_INCREMENT,\n" +
      "  `title` varchar(127) COLLATE utf8mb4_unicode_ci NOT NULL,\n" +
      "  `content` text COLLATE utf8mb4_unicode_ci,\n" +
      "  `deadline` datetime DEFAULT NULL,\n" +
      "  `priority` int(11) NOT NULL DEFAULT '0',\n" +
      "  `is_finished` tinyint(4) NOT NULL DEFAULT '0',\n" +
      "  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n" +
      "  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n" +
      "  PRIMARY KEY (`id`),\n" +
      "  KEY `deadline` (`deadline`),\n" +
      "  KEY `priority` (`priority`),\n" +
      "  KEY `is_finished` (`is_finished`)\n" +
      ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    await db_connection.query(todos_create_query);

    db_connection.end();
  } catch(err) {
    console.error(err);
    process.exit(-1);
  }
})();