var mysql = require('mysql2');
var db_config={
  host : '127.0.0.1',
  user:'root',
  password:'manjugk',
  database: 'webapp'
}

var connection;

function handleDisconnect(){
  connection = mysql.createConnection(db_config);
  connection.connect(function(err){
    if(err){
      console.log('error when connecting to db:',err);
      setTimeout(handleDisconnect,2000);
    }
  });
  connection.on('error',function(err){
    if(err.code=== 'PROTOCOL_CONNECTION_LIST'){
     handleDisconnect();
   }else{
     throw err;
   }
  });
}
handleDisconnect();
module.exports = connection;
