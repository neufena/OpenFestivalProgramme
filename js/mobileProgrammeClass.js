function mobileProgramme() {
	if (debug == true) console.log(Date.now() + ' mobileProgramme Class instantiated');
	var updated = false;
	var currentDay = 1;
	var e;
	var data;
	var local;
	var page;
	var name;
	var date;
	var days;
	var venue;
	var footerText;
	
	
	this.changePage = function (in_e, in_data,url)
	{
		if (debug == true) console.log(Date.now() + ' changePage called');
		e = in_e;
		data = in_data;
		page = url[0].split('#');
		id = url[1].split('=');
		sql = "SELECT * FROM tbl" + page[1] + " WHERE id=" + id[1];
		html5sql.process(
			sql,
			function(tx, results) {
				switch (page[1]) {
					case "stage":
						buildStage(results);
						break;
					case "act":
						buildAct(results);
						break;
					case "day":
						buildDay(results,id[1]);
						break;
				
					default:
						logError('incorrect page requested')
						break;
					
				}
			},
			function (error, statement) {
				if (debug == true) console.log(error);
				if (debug == true) console.log(statement);
				logError(error, statement);
			}
			);		
	}
    
	this.initProgramme = function ()
	{
		if (debug == true) console.log(Date.now() + ' startup called');
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
		if (debug == true) console.log(Date.now() + " openDatabase called");
		html5sql.openDatabase(
			databaseName,
			displayName,
			estimatedSize
			);
	}


	var checkDbVersion = function()
	{
		if (debug == true) console.log(Date.now() + " checkDbVersion called");
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
		if (debug == true) console.log(Date.now() + " compareVersions called");
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
		if (debug == true) console.log(Date.now() + " loadCreateSQL called");
		$.get('database/mobileProgramme.sql',
		{
			"_": $.now()
		},
		function(sql) {
			createDatabase(sql);
		}
		)
	}

	var createDatabase = function(sql) {
		if (debug == true) console.log(Date.now() + " createDatabase called");
		html5sql.process(sql,
			function(){
				checkDbVersion();
			},
			function(error, statement){
				if (debug == true) console.log(error);
				logError("Database create failed");
			}
			)
	}

	var updateData = function() {
		if (debug == true) console.log(Date.now() + " updateData called");
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
					logError('error updating database');
                    
				}
				)
		});
	}
	
	var populateEvent = function () {
		if (debug == true) console.log(Date.now() + ' populateEvent called');
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
		if (debug == true) console.log(Date.now() + ' buildMainPages called');
		
		
		if(days == 1) {
			footerText = $.datepicker.formatDate('dd MM yy',date);
		}
		else
		{
			endDate = new Date(date);
			endDate.setDate(date.getDate() + days-1 );
			if (date.getMonth() == endDate.getMonth()) {
				footerText = $.datepicker.formatDate('dd',date) + ' - ' + $.datepicker.formatDate('dd MM yy',endDate);
			} else {
				footerText = $.datepicker.formatDate('dd M',date) + ' - ' + $.datepicker.formatDate('dd M yy',endDate);
			}
		}	
		buildArtists();
		buildHome();
	}

	
	var buildHome = function() {
		$('#home div.header h1').html(name);
		$('#home div.footer h1').html(footerText);
		if(days == 1) {
			buildHomeOneDay();
		} else {
			buildHomeMultiDay();
		}	
	}
	
	var buildHomeOneDay = function() {
		if (debug == true) console.log(Date.now() + ' buildHomeOneDay called');
		sql = "SELECT id, name FROM tblStage ORDER BY displayOrder ASC";
		html5sql.process(
			sql,
			function(tx, results){
				numRows = results.rows.length;
				for (var i=0;i < numRows; i++) {
					$('#homeMainList').append(
						'<li><a href="#stage?id=' + results.rows.item(i).id +
						'">' + results.rows.item(i).name + '</a></li>'
						)
				}
				
				gotoPage('#home');
				try 
				{
					$('#homeMainList').listview('refresh');
				}
				catch (err)
				{}	   
			},
			function(error, statement){
				//TODO Try to kill and rebuild whole DB
				logError('error selecting Stages from database')
                    
			}
			)
	}
	
	var buildHomeMultiDay = function() {
		if (debug == true) console.log(Date.now() + ' buildHomeMultiDay called');
		var dayDate = new Date(date);
		for (var i=0;i < days; i++) {
			dayDate.setDate(date.getDate() + i );
			dayText = $.datepicker.formatDate('d M - DD',dayDate);
			dayID=i+1;
			$('#homeMainList').append(
				'<li><a href="#day?id=' + dayID +
				'">' + dayText + '</a></li>'
				)
		}
				
		gotoPage('#home');
		$('#homeMainList').listview('refresh');
	}
    
	var buildArtists = function() {
		if (debug == true) console.log(Date.now() + ' buildArtists called');
		$('#artists div.header h1').html(name + ' - Artists');
		$('#artists div.footer h1').html(footerText);
		sql = "SELECT id, name, page FROM tblAct ORDER BY name ASC";
		html5sql.process(
			sql,
			function(tx, results){
				numRows = results.rows.length;
				for (var i=0;i < numRows; i++) {
					if ( results.rows.item(i).page != '' ) {
						id = results.rows.item(i).page;
					} else {
						id = results.rows.item(i).id;
					}
					$('#artistsMainList').append(
						'<li><a href="#act?id=' + id +
						'">' + results.rows.item(i).name + '</a></li>'
						)
					
				}
				try 
				{
					$('#artistsMainList').listview('refresh')
				}
				catch (err)
				{}	
				
			},
			function(error, statement){
				//TODO Try to kill and rebuild whole DB
				logError('error selecting Stages from database')
                    
			}
			)
        
	}
	
	var buildStage = function(results) {
		results = results.rows.item(0);
		if (debug == true) console.log(Date.now() + ' buildStage called');
		$('#stage div.header h1').html(name + ' - ' + results.name);
		$('#stage div.footer h1').html(footerText);
		if (results.publishTimes == 1) {
			sql = 'SELECT time, tblAct.id, name, page \n\
					FROM tblActStage, tblAct WHERE tblAct.id = tblActStage.actID \n\
					AND stageID=' + results.id + ' AND day = ' + currentDay + ' ORDER BY time DESC';
		}
		else 
		{
			sql = 'SELECT tblAct.id, name, page FROM \n\
					tblActStage, tblAct WHERE tblAct.id = tblActStage.actID AND \n\
					stageID=' + results.id + ' AND day = ' + currentDay + ' ORDER BY time DESC';
		}
		html5sql.process(
			sql,
			function(tx, results){
				$('#stageMainList').html("");
				numRows = results.rows.length;
				for (var i=0;i < numRows; i++) {
					if ( results.rows.item(i).page != '' ) {
						id = results.rows.item(i).page;
					} else {
						id = results.rows.item(i).id;
					}
					if(results.rows.item(i).time == undefined) {
						linkText = results.rows.item(i).name;
					} else {
						linkText = results.rows.item(i).time + ' - ' + results.rows.item(i).name;
					}	
					$('#stageMainList').append(
						'<li><a href="#act?id=' + id +
						'">' + linkText + '</a></li>'
						)
				}
				try 
				{
					$('#stageMainList').listview('refresh');
				}
				catch (err)
				{}	
				
				gotoPage('#stage');
				
				
			},
			function(error, statement){
				//TODO Try to kill and rebuild whole DB
				logError('error selecting Acts from database')       
			}			
			)
	}
	
	var buildDay = function(results, dayID) {
		currentDay = dayID;
		results = results.rows;
		if (debug == true) console.log(Date.now() + ' buildDay called');
		$('#day div.header h1').html(name + ' - ' + results.name);
		$('#day div.footer h1').html(footerText);
		$('#dayMainList').html("");
		numRows = results.length;
		for (var i=0;i < numRows; i++) {
			$('#dayMainList').append(
				'<li><a href="#stage?id=' + results.item(i).stageID +
				'">' + results.item(i).name + '</a></li>'
				)
		}
		try 
		{
			$('#dayMainList').listview('refresh');
		}
		catch (err)
		{}
		
		gotoPage('#day');
		
		
	}
	
	var buildAct = function(results) {
		results = results.rows.item(0);
		if (debug == true) console.log(Date.now() + ' buildAct called');
		console.log(results);	
		$('#act div.header h1').html(name + ' - ' + results.name);
		$('#act div.footer h1').html(footerText);
		
		
	}
	
	
	var gotoPage = function(page) 
	{
		if (debug == true) console.log(Date.now() + " gotoPage called with " + page);
		$.mobile.changePage(page);
        
	}
		
	var resolvePage = function(page) 
	{
		if (debug == true) console.log(Date.now() + " resolvePage called with " + page);
		
	}
    
	var logError = function(msg) 
	{
		if (debug == true) console.log(Date.now() + ' ERROR:- '+msg);
		gotoPage('#error');
	}

	$.ajaxSetup({
		error: function() {
            
			if (local.dbVersion == 0)
			{
				data.deferred.reject( data.absUrl, data.options);
				gotoPage('noDataNoNetwork');
				
			} else {
				if (debug == true) console.log(Date.now() + ' Not Online - carry on with local data only');
			//Todo build page from DB then resolve
			}
            
		}
	});
}
/*
            
 */

