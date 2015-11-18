var mysql = require("mysql");

module.exports =  {
    blank: function(){ return {} },
    get: function(id, ret){
        var conn = GetConnection();
        var sql = 'SELECT * FROM 2015Fall_Users ';
        if(id){
          sql += " WHERE id = " + id;
        }
        conn.query(sql, function(err,rows){
          ret(err,rows);
          conn.end();
        });        
    },
    delete: function(id, ret){
        var conn = GetConnection();
        conn.query("DELETE FROM 2015Fall_Users WHERE id = " + id, function(err,rows){
          ret(err);
          conn.end();
        });        
    },
    save: function(row, ret){
        var sql;
        var conn = GetConnection();
        //  TODO Sanitize
        if (row.id) {
				  sql = " Update 2015Fall_Users "
							+ " Set Name=?, Age=? , Height=? , Weight=?, Avatar=?, Status='offline'"
						  + " WHERE id = ? ";
			  }else{
				  sql = "INSERT INTO 2015Fall_Users "
						  + " (Name, Age, Height,Weight, Avatar,Status ) "
						  + "VALUES (?, ?, ?, ?, ?, 'offline' ) ";				
			  }

        conn.query(sql, [row.Name, row.Age, row.Height, row.Weight, row.Avatar, row.id],function(err,data){
          if(!err && !row.id){
            row.id = data.insertId;
          }
          ret(err, row);
          conn.end();
        });        
    },
    validate: function(row){
      var errors = {};
      
      if(!row.Name) errors.Name = "is required"; 
      
      return errors.length ? errors : false;
    }
};  

function GetConnection(){
        var conn = mysql.createConnection({
          host: "localhost",
          user: "anthonybjturner",
          password: "",
          database: "turnera1_db"
        });
    return conn;
}