CREATE TABLE tblAct (
  id INTEGER PRIMARY KEY,
  name TEXT,
  description TEXT,
  image BLOB,
  video BLOB,
  website TEXT,
  page TEXT
  );

CREATE TABLE tblActStage (
  day INTEGER,
  stageID INTEGER,
  actID INTEGER,
  time TEXT,
  duration REAL
);

CREATE TABLE tblEvent (
  id INTEGER PRIMARY KEY,
  name TEXT,
  eventDate TEXT,
  days INTEGER,
  venue TEXT
);


CREATE TABLE tblStage (
  id INTEGER PRIMARY KEY,
  name TEXT,
  displayOrder INTEGER,
  publishTimes INTEGER
);


CREATE TABLE tblVersion (
  appVersion REAL PRIMARY KEY,
  dbVersion REAL
);

INSERT INTO tblVersion VALUES (0.1, 0);

