drop table if exists products;
drop table if exists featured_products;

create table products {
    id serial primary key,
    title varchar(250) not null,
    description text null,
    image varchar(250) null
};

create table featured_products {
    id serial primary key,
    product_id integer not null
};
