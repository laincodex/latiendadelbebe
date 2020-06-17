DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS featured_products;
DROP TABLE IF EXISTS carousel;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS carousel_positions;

create table products (
    id integer primary key autoincrement,
    title varchar(250) not null,
    description text null,
    date integer not null,
    available boolean not null,
    is_featured boolean not null
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

insert into products(title, description, date, available, is_featured) values
    ('Producto 1', '1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', 'now'), true, false),
    ('Producto 2', '2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', 'now'), true, false),
    ('Producto 3', '3 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', 'now'), true, true),
    ('Producto 4', '4 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', 'now'), false, true),
    ('Producto 5', '5 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', 'now'), false, false);
