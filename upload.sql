-- mysql -h localhost < [this file]

use aspen;
drop table if exists Users;
drop table if exists Projects;
drop table if exists States;

create table Users
(
    id int not null auto_increment,
    username varchar(32) not null unique,
    pw varchar(64) not null,
    constraint pk_id primary key (id)
);

insert into Users (username, pw)
    values ('kchen', 'pw');

create table Projects
(
    id int not null auto_increment,
    name varchar(128) not null,
    url varchar(128) not null unique,
    currentStateId int,
    constraint pk_id primary key (id)
);

insert into Projects (name, url)
    values ('Aspen Text', 'http://localhost:8091');
insert into Projects (name, url)
    values ('Aspire', 'http://localhost:8092');
insert into Projects (name, url)
    values ('Aspen Excel', 'http://localhost:8093');

create table States
(
    id int not null auto_increment,
    path varchar(256),  -- path where entire state is stored
    projectId int not null,
    parentId varchar(256),  -- id of parent state, or null if root
    name varchar(256),  -- short name of state
    icon varchar(256),  -- path of icon
    timestamp timestamp,
    constraint pk_id primary key (id)
);

insert into States (path, projectId)
    values ('objects/something', -1);

