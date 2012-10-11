var updated;

$(document).bind( "pagebeforechange", function( e, data ) {
    
    var e;
    var data;
    if(updated != true) {
        e.preventDefault();  
        html5sql.openDatabase(
            databaseName,
            displayName,
            estimatedSize
            );
        html5sql.process(
            "SELECT * FROM tblVersion",
            function(tx, results){
                var len = results.rows.length;
                console.log("Database Exists - update data");
                updateData(results)                    
                        
            },
            function(error, statement){
                console.log("Database Does Not Exist");
                $.get('database/mobileProgramme.sql',
                    createDatabase(sql),
                    function(){
                        console.log("Get database sql create failed");
                    });           
            }   
            );            
    } else {
        console.log("Already up to date, continue with jqm");
    }
});
            
function createDatabase(sql) {
    html5sql.process(sql),
    function(){
        console.log("db create SQL ran correctly");
        html5sql.process(
            "SELECT * FROM tblVersion",
            function(tx, results){
                var len = results.rows.length;
                console.log("Database Created - update data");
                updateData(results)                              
            }
            )                      
    },
    function(){
        console.log("Database create failed");
    }                    
}            

function updateData(results) {
    console.log("Database Contains version - check is same as online");
    var local = results.rows.item(0);
    $.get(ajaxHost + 'AJAX/requestHander.php?action=getVersion', function(rtn) {
        if (local.dbVersion != rtn.dbVersion) {
            console.log('Remote data is newer than local');
            $.get(ajaxHost + 'AJAX/requestHander.php?action=getData', function(rtn) {
                var sql = [];
                $.each(rtn, function(table,rows) {
                    insertstring = 'INSERT OR REPLACE INTO ' + table + ' ('                  
                    $.each(rows, function(index, row) {
                        fieldstring = '';
                        valuestring = '';
                        $.each(row, function(field, value) {
                            fieldstring += field +',';
                            valuestring += "'" + value +"',";
                            
                        }) 
                        sql.push(insertstring + fieldstring.slice(0,-1) + ') VALUES (' + valuestring.slice(0,-1) + ');');
                    })
                    
                });
                html5sql.process(
                    sql,
                    function(tx, results){ 
                        console.log(tx);
                        console.log(results);                           
                    },
                    function(error, statement){
                        console.log(error);
                        console.log(statement);   
                    }
                )   
            });
        } else {
            console.log('Database is up to date')
            data.deferred.resolve( data.absUrl, data.options, page );
        }
    }); 
}

