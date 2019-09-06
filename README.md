# Todo List - 2nd assignment (Web)

This project is web application for 2nd assignment from ["Silicon Valley Job Fair 2019"](https://programmers.co.kr/competitions/104/siliconvalley-jobfair2019).


#### Environment variables for MySQL database
Before start, please create mysql dateabase first.  
`utf8mb4` charset and `utf8mb4_unicode_ci` collate is recommended.
```shell script
MYSQL_ROOT_HOST = mysql-server
MYSQL_USER = root
MYSQL_ROOT_PASSWORD = password
MYSQL_DATABASE = my_database
```

### Before start
```shell script
$ npm install
$ npm run create-db-table
```

### How to start
```shell script
$ npm start
```

#### Web Frontend
For frontend, it uses [React](https://reactjs.org/) with [Material-UI](https://material-ui.com/).  
It is generated as a Single Page Application. Therefore, every time it gets new data from server, page does not refreshed.

#### Web Backend
For backend, it uses [ExpressJS](https://expressjs.com/) as a http server.  
Since this server is used for API only, it accepts requests for JSON format only and generate responses to JSON format too.  

#### Database
It uses '[mysql2](https://www.npmjs.com/package/mysql2)' npm module.  
Because I do not prefer ORM, I wrote each query manually.

#### Other things
- This project does not have user account system because it is not in the requirements.  
- TodoList will be refreshed every 10 seconds.  
- Items will be sorted in this order.
    - unique id for each todo item
    - priority value
    - deadline time (if each item has it)
    - finished status
- To sort todo items stable(maintain previously sorted status), I use [Lodash](https://lodash.com/) because built-in javascript array does not have stable sort.