-- mysql -h localhost < [this file]

use pando;
drop table if exists Users;

create table Users
(
    id int not null auto_increment,
    username varchar(32) not null unique,
    pw varchar(64) not null,
    constraint pk_id primary key (id)
);

insert into Users (username, pw)
    values ('kchen', 'pw')

