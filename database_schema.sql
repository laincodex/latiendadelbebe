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
    is_featured boolean not null
);

create table categories (
    id integer primary key autoincrement,
    name varchar not null
);

create table product_images (
    id integer primary key,
    product_id integer not null,
    image_full varchar null,
    thumbnail varchar null, 
    thumbnail_preview varchar null
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

insert into products(title, description, date, categories, available, is_featured) values
    ('Producto 1', '1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', 'now'), "[1,2]", true, false),
    ('Producto 2', '2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', 'now'), "[1,3]",true, false),
    ('Producto 3', '3 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', 'now'), "[2,3]",true, true),
    ('Producto 4', '4 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', 'now'), "[4]",false, true),
    ('Producto 5', '5 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', 'now'), "[5]",false, false),
    ('Producto 6', '6 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', 'now'), "[5]",false, false),
    ('Producto 7', '7 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', 'now'), "[5]",false, false),
    ('Producto 8', '8 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', 'now'), "[5]",false, false),
    ('Producto 9', '9 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', 'now'), "[5]",false, false),
    ('Producto 10', '10 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', 'now'), "[5]",false, false),
    ('Producto 11', '11 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ligula orci, vehicula eget neque eu, ultrices viverra nisi. Pellentesque aliquet odio id condimentum ullamcorper', strftime('%s', 'now'), "[5]",false, false);

insert into categories(name) values ("Remeras"), ("Conjuntos"), ("Buzos"), ("Zapatillas"), ("Accesorios");
