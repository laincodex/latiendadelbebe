DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS featured_products;
DROP TABLE IF EXISTS carousel;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS carousel_positions;
DROP TABLE IF EXISTS categories;

create table products (
    id integer primary key autoincrement,
    title varchar not null,
    description text null,
    date integer not null,
    categories varchar not null,
    available boolean not null,
    is_featured boolean not null,
    primary_image_id integer not null
);

create table categories (
    id integer primary key autoincrement,
    name varchar not null
);

create table product_images (
    id integer primary key autoincrement,
    product_id integer not null,
    image_url varchar null
);

create table carousel (
    id integer primary key autoincrement,
    image_url varchar not null,
    label varchar null
);

create table carousel_positions (
    id integer not null
);

insert into carousel(image_url, label) values('carousel_1.png', 'Tenemos todo para ellos');
insert into carousel(image_url, label) values('carousel_2.png', 'Y para ellas');
insert into carousel_positions(id) values('2'), ('1');

insert into products(title, description, date, categories, available, is_featured, primary_image_id) values
    ('Producto 1', '1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', '2020-06-18'), "[1,2]", true, false, '1');
insert into categories(name) values ("Remeras"), ("Conjuntos"), ("Buzos"), ("Zapatillas"), ("Accesorios");

insert into product_images(product_id, image_url) values 
    ('1', 'product-1.jpg'),
    ('1', 'product-2.jpg');