DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS featured_products;
DROP TABLE IF EXISTS carousel;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS carousel_positions;

create table products (
    id serial primary key,
    title varchar(250) not null,
    description text null,
    price varchar(250) null,
    availability integer not null
);

create table featured_products (
    id serial primary key,
    product_id integer not null
);

create table product_images (
    id serial primary key,
    product_id integer not null,
    image_full varchar(250) null,
    thumbnail varchar(250) null, 
    thumbnail_preview varchar(250) null
);

create table carousel (
    id integer primary key autoincrement,
    image_url varchar(250) not null,
    label varchar(250) null
);

create table carousel_positions (
    id integer not null
);

insert into carousel(image_url, label) values('carousel_1.png', 'Tenemos todo para ellos');
insert into carousel(image_url, label) values('carousel_2.png', 'Y para ellas');
insert into carousel_positions(id) values('2'), ('1');