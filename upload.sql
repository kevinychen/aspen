-- mysql -h localhost < [this file]

use pando;
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
    serviceUrl varchar(128) not null,
    projectHash varchar(256) not null,  -- id of project according to service
    constraint pk_id primary key (id)
);

create table States
(
    id int not null auto_increment,
    stateHash varchar(256) not null,  -- id of state according to service
    projectId int not null,
    isCurrent int,  -- true if project is currently on this state
    parentHash varchar(256),  -- id of parent state, or null if root
    constraint pk_id primary key (id)
);

