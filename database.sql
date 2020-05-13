drop table if exists products;
drop table if exists featured_products;

create table products {
    id serial primary key,
    title varchar(250) not null,
    description text null,
    price varchar(250) null,
    availability integer not null
};

create table featured_products {
    id serial primary key,
    product_id integer not null
};

create table products_images {
    id serial primary key,
    product_id integer not null,
    image_full varchar(250) null,
    thumbnail varchar(250) null, 
    thumbnail_preview varchar(250) null
}