import mysql from 'mysql';
import migration from 'mysql-migrations'
import path from 'path'

var connection = mysql.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  user     : 'kindmind',
  password : 'kindmind',
  database : 'kindmind',
  insecureAuth : true
});

migration.init(connection, path.join('db/migrations'), function() {
  console.log("finished running migrations");
});
