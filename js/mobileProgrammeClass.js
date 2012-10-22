function mobileProgramme() {
    if (debug == true) console.log(Date.now() + ' mobileProgramme Class instantiated');
    var buildingDays = false;
    var buildingStages = false;
    var buildingActs = false;
    var currentDay = 1;
    var tryRebuild = false;
    var local;
    var page;
    var name;
    var date;
    var days;
    var footerText;
    var startPage;


    this.setStartPage = function(in_startPage) {
        if (debug == true) console.log(Date.now() + ' setStartPage called with '+ in_startPage);
        startPage = in_startPage;
    }

    this.setCurrentDay = function(in_currentDay) {
        if (debug == true) console.log(Date.now() + ' setCurrentDay called with ' + in_currentDay);
        currentDay = in_currentDay;
    }

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
        if (debug == true) console.log(Date.now() + ' initProgramme called');
        openDatabase();
        checkDbVersion();
    }

    this.removeDatabaseVersion = function() {
        html5sql.openDatabase(
            databaseName,
            displayName,
            estimatedSize
            );
        html5sql.process(
            "DROP TABLE IF EXISTS tblVersion; \n\
            DROP TABLE IF EXISTS tblAct; \n\
            DROP TABLE IF EXISTS tblActStage;\n\
            DROP TABLE IF EXISTS tblEvent;\n\
            DROP TABLE IF EXISTS tblStage;",
            function() {
                if(tryRebuild == true) 
                {
                    initProgramme();
                }
            }
            );
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
            "SELECT * FROM tblVersion ORDER BY appVersion, dbVersion",
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
                if (local.appVersion != rtn.appVersion && local.appVersion != 0) {
                    startPage = '#upgrade'
                    updated = true;
                    populateEvent();
                }
                else if (local.dbVersion != rtn.dbVersion) {
                    updateData();
                } else {
                    updated = true;
                    populateEvent();
                }
            },
            "json"
            );
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
                        '<li><a href="#stage_' + results.rows.item(i).id +
                        '_1">' + results.rows.item(i).name + '</a></li>'
                        )
                }
                if (startPage == '#home')
                {
                    gotoPage('#home');
                    $('#homeMainList').listview('refresh');
                    buildAllPages();
                } else {
                    buildAllPages();
                }
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
                '<li><a href="#day_' + dayID +
                '">' + dayText + '</a></li>'
                )
        }

        if (startPage == '#home')
        {
            gotoPage('#home');
            $('#homeMainList').listview('refresh');
            buildAllPages();
        } else {
            buildAllPages();
        }
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
                        '<li><a href="#act_' + id +
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
    var buildDays = function() {
        if (debug == true) console.log(Date.now() + ' buildDays called');
        for (var i=0; i < days; i++) {
            dayID = i+1
            sql = 'SELECT * FROM tblDay WHERE id = ' + dayID
            html5sql.process(
                sql,
                function(tx, results){
                    results = results.rows;
                    dayMod = results.item(0).id -1;
                    thisDate = new Date(date);
                    thisDate.setDate(date.getDate() + dayMod );
                    thisDayText = $.datepicker.formatDate('DD',thisDate);
                    newDay = $('#day').clone();
                    newID = 'day_' + results.item(0).id;
                    newDay.attr('id',newID);
                    $('body').append(newDay)
                    $('#' + newID + ' .header h1').html(name + ' - ' + thisDayText);
                    $('#' + newID + ' .footer h1').html(footerText);
                    list = $('#' + newID + ' .dayMainList');
                    list.html("");
                    for (var i = 0; i < results.length ; i++)
                    {
                        list.append(
                            '<li><a href="#stage_' + results.item(i).stageID + '_' + results.item(i).id +
                            '">' + results.item(i).name + '</a></li>'
                            );
                    }
                    if (results.item(0).id == days)
                    {
                        buildingDays = false;
                    }
                    if (buildingDays == false && buildingStages == false && buildingActs == false) {
                        gotoPage(startPage);
                    }

                },
                function(error, statement){
                    //TODO Try to kill and rebuild whole DB
                    logError('error selecting Acts from database')
                }
                )
        }
    }
    var buildStages = function() {
        if (debug == true) console.log(Date.now() + ' buildStages called');
        sql = '\
			SELECT tblStage.name as stageName, publishTimes, actID, tblAct.name, time, page, stageID, day FROM tblStage, tblActStage, tblAct \
			WHERE tblStage.id = tblActStage.stageID \
			AND tblActstage.actID = tblAct.id \
			ORDER BY day ASC, stageID ASC, time DESC';
        html5sql.process(
            sql,
            function(tx, results){
                results = results.rows;
                stageID = null;
                stageDay = null;

                for (var i=0; i < results.length; i++) {
                    if (stageID != results.item(i).stageID || stageDay != results.item(i).day)
                    {
                        stageName = results.item(i).stageName;
                        stagePublishTimes = results.item(i).publishTimes;
                        stageID = results.item(i).stageID;
                        stageDay = results.item(i).day;
                        dayMod = stageDay -1;
                        thisDate = new Date(date);
                        thisDate.setDate(date.getDate() + dayMod );
                        thisStageText = stageName + ' - ' + $.datepicker.formatDate('DD',thisDate);
                        newStage = $('#stage').clone();
                        newID = 'stage_' + stageID + '_' + stageDay;
                        newStage.attr('id',newID);
                        $('body').append(newStage)
                        $('#' + newID + ' .header h1').html(name + ': ' + thisStageText);
                        $('#' + newID + ' .footer h1').html(footerText);
                        list = $('#' + newID + ' .stageMainList');
                        list.html("");
                    }
                    if( results.item(i).publishTimes == 1 ) {
                        actText = results.item(i).time + ': ' + results.item(i).name;
                    }
                    else
                    {
                        actText = results.item(i).name
                    }
                    if ( results.item(i).page == '' ) {
                        actID = results.item(i).actID;
                    }
                    else
                    {
                        actID = results.item(i).page;
                    }
                    list.append(
                        '<li><a href="#act_' + actID +
                        '">' + actText + '</a></li>'
                        );
                }
                buildingStages = false;
                if (buildingDays == false && buildingStages == false && buildingActs == false) {
                    gotoPage(startPage);
                }

            },
            function(error, statement){
                //TODO Try to kill and rebuild whole DB
                logError('error selecting Acts from database')
            }
            )
    }
    var buildActs = function() {
        if (debug == true) console.log(Date.now() + ' buildActs called');
        //Note only build for where page is null
        sql = 'SELECT * FROM tblAct WHERE page = ""'
        html5sql.process(
            sql,
            function(tx, results){
                results = results.rows;
                for ( i=0; i < results.length ; i++) {
                    newAct = $('#act').clone();
                    newID = 'act_' + results.item(i).id;
                    newAct.attr('id',newID);
                    $('body').append(newAct)
                    $('#' + newID + ' .header h1').html(name + ' - ' + results.item(i).name);
                    $('#' + newID + ' .footer h1').html(footerText);
                    actContent = $('#' + newID + ' .actContent');
                    actContent.html('');
                    if (results.item(i).image != '')
                    {
                        actContent.append('<div class="picture">\n\
                                        <img src="data:image/jpeg;base64,' + results.item(i).image +
                            '" alt="' + results.item(i).name + '" /></div>');
                    }
                    actContent.append('<div class="description"><p>' + results.item(i).description + '</p>');
                    if (results.item(i).website != '') {
                        actContent.append('<p><a href="' + results.item(i).website + '">Website</a></p>');
                    }
                    actContent.append('</div>');
                    if (results.item(i).video != '')
                    {
                        actContent.append('<div class="video"><a href="http://m.youtube.com/watch?v=' + results.item(i).video +
                            '"><img src="data:image/jpeg;base64,' + results.item(i).videothumb +
                            '" alt="' + results.item(i).name + ' video" /></a></div>');
                    }
                }
                buildingActs = false;
                if (buildingDays == false && buildingStages == false && buildingActs == false) {
                    gotoPage(startPage);

                }

            },
            function(error, statement){
                //TODO Try to kill and rebuild whole DB
                logError('error selecting Acts from database')
            }
            )
    }
    var buildAllPages = function() {
        if (debug == true) console.log(Date.now() + " buildAllPages called");
        buildingStages = true;
        buildingActs = true;
        if (days != 1)
        {
            buildingDays = true;
            buildDays();
        }
        buildStages();
        buildActs();
    }
    var gotoPage = function(page)
    {
        if (debug == true) console.log(Date.now() + " gotoPage called with " + page);
        $.mobile.changePage(page);
        
    }
    
    var logError = function(msg)
    {
        console.log(Date.now() + ' ERROR:- '+msg);
        gotoPage('#error');
    }

    $.ajaxSetup({
        error: function() {
            
            if (local.dbVersion == 0)
            {
                gotoPage('#noDataNoNetwork');
            } else {
                if (debug == true) console.log(Date.now() + ' Not Online - carry on with local data only');
                updated = true;
                populateEvent();
                
            }
            
        }
    });
}
/*
            
 */

