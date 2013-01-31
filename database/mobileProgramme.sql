DROP TABLE IF EXISTS tblAct;
CREATE TABLE tblAct (
  id INTEGER PRIMARY KEY,
  name TEXT,
  description TEXT,
  image BLOB,
  video TEXT,
  videothumb BLOB,
  website TEXT,
  page TEXT
  );

DROP TABLE IF EXISTS tblActStage;
CREATE TABLE tblActStage (
  id INTEGER PRIMARY KEY,
  day INTEGER,
  stageID INTEGER,
  actID INTEGER,
  time TEXT,
  duration REAL
);

DROP TABLE IF EXISTS tblEvent;
CREATE TABLE tblEvent (
  id INTEGER PRIMARY KEY,
  name TEXT,
  eventDate TEXT,
  days INTEGER,
  venue TEXT
);

DROP TABLE IF EXISTS tblStage;
	CREATE TABLE tblStage (
	  id INTEGER PRIMARY KEY,
	  name TEXT,
	  displayOrder INTEGER,
	  publishTimes INTEGER
	);


DROP VIEW IF EXISTS tblDay;
CREATE VIEW tblDay AS
SELECT
day AS id,
name,
stageID
FROM tblStage, tblActStage
WHERE tblStage.id = tblActStage.stageID
GROUP BY name,day
ORDER BY displayOrder;

DROP TABLE IF EXISTS tblVersion;
CREATE TABLE tblVersion (
  appVersion REAL PRIMARY KEY,
  dbVersion REAL,
  imgVersion REAL
);

INSERT INTO tblVersion VALUES (0, 0, 0);

