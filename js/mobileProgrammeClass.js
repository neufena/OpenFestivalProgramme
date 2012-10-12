function mobileProgramme() {
	console.log('mobileProgramme Class instantiated');
	var updated = false;
	var e;
	var data;
	var local;
	var page;
	var name;
	var date;
	var days;
	var venue;
	var footerText;
	
	this.changePage = function (in_e, in_data)
	{
		console.log('changePage called');
		var u = $.mobile.path.parseUrl( in_data.toPage );
		if (u.search == '') {
			return;
		}
		e = in_e;
		data = in_data;
		page = data.toPage;
		if(updated == true) {
			e.preventDefault();
			buildPage();
			return;
		}     
		e.preventDefault();
		openDatabase();
		checkDbVersion();
	}
    
	this.initProgramme = function ()
	{
		console.log('startup called');
		openDatabase();
		checkDbVersion();
	}

	this.removeDatabaseVersion = function() {
		html5sql.openDatabase(
			databaseName,
			displayName,
			estimatedSize
			);
		html5sql.process("DROP TABLE IF EXISTS tblVersion");
	}

	var openDatabase = function() {
		console.log("openDatabase called");
		html5sql.openDatabase(
			databaseName,
			displayName,
			estimatedSize
			);
	}


	var checkDbVersion = function()
	{
		console.log("checkDbVersion called");
		html5sql.process(
			"SELECT * FROM tblVersion",
			function(tx, results) {
				compareVersions(tx, results);
			},
			function (error, statement) {
				loadCreateSQL(error, statement)
			}
			);
	}

	var compareVersions = function(tx, results)
	{
		console.log("compareVersions called");
		local = results.rows.item(0);
		$.get(
			ajaxHost + 'AJAX/requestHander.php?action=getVersion',
			function(rtn) {
				if (local.dbVersion != rtn.dbVersion) {
					updateData();
				} else {
					updated = true;
					populateEvent();
                   
				}
			},
			"json"
			)

	}

	var loadCreateSQL = function(error, statement){
		console.log("loadCreateSQL called");
		$.get('database/mobileProgramme.sql',
			function(sql) {
				createDatabase(sql);
			}
			)
	}

	var createDatabase = function(sql) {
		console.log("createDatabase called");
		html5sql.process(sql,
			function(){
				checkDbVersion();
			},
			function(error, statement){
				console.log(error);
				logError("Database create failed");
			}
			)
	}

	var updateData = function() {
		console.log("updateData called");
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
					checkDbVersion();
				},
				function(error, statement){
					//TODO Try to kill and rebuild whole DB
					logError('error updating database')
                    
				}
				)
		});
	}
	
	var populateEvent = function () {
		console.log('populateEvent called');
		sql = 'SELECT name, eventDate, days, venue FROM tblevent';
		html5sql.process(
			sql,
			function(tx, results){
				name = results.rows.item(0).name;
				date = new Date(results.rows.item(0).eventDate);
				days = results.rows.item(0).days;
				venue = results.rows.item(0).venue;
				buildMainPages();
			},
			function(error, statement){
				//TODO Try to kill and rebuild whole DB
				logError('error getting event from database')
                    
			}
			)
		
	}
	
    
	var buildMainPages = function() {
		console.log('buildMainPages called');
		footerText = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
		if(days != 1) {
			endDate = new Date(date);
			endDate.setDate(date.getDate() + days-1 );
			footerText += ' - ' + endDate.getDate() + '/' + (endDate.getMonth() + 1) + '/' + endDate.getFullYear();
		}	
		buildArtists();
		buildHome();
	}
    
	
	var buildHome = function() {
		$('#home div.header h1').append(name);
		$('#home div.footer h1').append(footerText);
		if(days == 1) {
			buildHomeOneDay();
		} else {
			buildHomeMultiDay(days);
		}	
	}
	
	var buildHomeOneDay = function() {
		console.log('buildHomeOneDay called');
		sql = "SELECT id, name FROM tblStage ORDER BY displayOrder ASC";
		html5sql.process(
			sql,
			function(tx, results){
				listElement = $('#homeMainList');
				numRows = results.rows.length;
				for (var i=0;i < numRows; i++) {
					listElement.append(
						'<li><a href="#stage?id=' + results.rows.item(i).id +
						'">' + results.rows.item(i).name + '</a></li>'
						)
				}
				$.mobile.changePage('#home');
            
                
			},
			function(error, statement){
				//TODO Try to kill and rebuild whole DB
				logError('error selecting Stages from database')
                    
			}
			)
	}
    
	var buildArtists = function() {
		console.log('buildArtists called');
		$('#artists div.header h1').append(name + ' - Artists');
		$('#artists div.footer h1').append(footerText);
		sql = "SELECT id, name, page FROM tblAct ORDER BY name ASC";
		html5sql.process(
			sql,
			function(tx, results){
				listElement = $('#artistsMainList');
				numRows = results.rows.length;
				for (var i=0;i < numRows; i++) {
					if ( results.rows.item(i).page != '' ) {
						id = results.rows.item(i).page;
					} else {
						id = results.rows.item(i).id;
					}
					listElement.append(
						'<li><a href="#artist?id=' + id +
						'">' + results.rows.item(i).name + '</a></li>'
						)
				}
                
			},
			function(error, statement){
				//TODO Try to kill and rebuild whole DB
				logError('error selecting Stages from database')
                    
			}
			)
        
	}
	
	var buildPage = function() 
	{
		console.log("buildPage called");
                
		//Parse page to find out what base template to use
		//TODO look up str replace or substring
                
		page = 'home'
		switch (page) {
			case 'home':
				buildHome();
				break;
                        
		}
                

	}
	
	var gotoPage = function(page) 
	{
		console.log("gotoPage called with " + page);
        
	}
		
	var resolvePage = function(page) 
	{
		console.log("resolvePage called with " + page);
		
	}
    
	var logError = function(msg) 
	{
		console.log('ERROR:- '+msg);
		gotoPage('error');
	}

	$.ajaxSetup({
		error: function() {
            
			if (local.dbVersion == 0)
			{
				data.deferred.reject( data.absUrl, data.options);
				gotoPage('noDataNoNetwork');
				
			} else {
				console.log('Not Online - carry on with local data only');
			//Todo build page from DB then resolve
			}
            
		}
	});
}
/*
            
 */

