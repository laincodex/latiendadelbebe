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
    ('Producto 1', '1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', '2020-06-18'), "[1,2]", true, false, '1'),
    ('Producto 2', '2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', '2020-06-20'), "[1,3]",true, false, '2'),
    ('Producto 3', '3 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', '2020-06-21'), "[2,3]",true, true, '3'),
    ('Producto 4', '4 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', '2020-06-21'), "[4]",false, true, '4'),
    ('Producto 5', '5 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', '2020-06-21'), "[5]",false, false, '5'),
    ('Producto 6', '6 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', '2020-06-21'), "[5]",false, false, '6'),
    ('Producto 7', '7 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', '2020-06-21'), "[5]",false, false, '7'),
    ('Producto 8', '8 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', '2020-06-21'), "[5]",false, false, '8'),
    ('Producto 9', '9 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', '2020-06-21'), "[5]",false, false, '9'),
    ('Producto 10', '10 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', '2020-06-21'), "[5]",false, false, '10'),
    ('Producto 11', '11 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', '2020-06-21'), "[5]",false, false, '11'),
    ('Producto 12', '12 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', '2020-06-26'), "[1,2,3,4,5]",false, false, '11');

insert into categories(name) values ("Remeras"), ("Conjuntos"), ("Buzos"), ("Zapatillas"), ("Accesorios");

insert into product_images(product_id, image_url) values 
    ('1', 'product-1.jpg'),
    ('1', 'product-2.jpg'),
    ('2', 'product-2.jpg'),
    ('3', 'product-1.jpg'),
    ('4', 'product-2.jpg'),
    ('5', 'product-1.jpg'),
    ('6', 'product-2.jpg'),
    ('7', 'product-1.jpg'),
    ('8', 'product-2.jpg'),
    ('9', 'product-1.jpg'),
    ('10', 'product-2.jpg'),
    ('11', 'product-1.jpg');