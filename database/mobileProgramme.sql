DROP TABLE IF EXISTS tblAct;
CREATE TABLE tblAct (
  id INTEGER PRIMARY KEY,
  name TEXT,
  description TEXT,
  image BLOB,
  video BLOB,
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

DROP TABLE IF EXISTS tblVersion;
CREATE TABLE tblVersion (
  appVersion REAL PRIMARY KEY,
  dbVersion REAL
);

INSERT INTO tblVersion VALUES (0.1, 0);

