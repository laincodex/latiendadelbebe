import { Database } from "sqlite";

export interface TProduct {
    id :number,
    title :string,
    description :string,
    date :number,
    categories :string,
    available :boolean,
    is_featured :boolean,
    primary_image_id :number,
    primary_image_url? :string
};

const getFilterSql = (filter :string ) :string => {
    switch (filter) {
        case 'recent':
            return 'ORDER BY date DESC';
        case 'older':
            return 'ORDER BY date ASC';
        case 'nostock':
            return 'AND available = false ORDER BY id ASC';
        case 'titledesc':
            return 'ORDER BY title DESC';
        case 'titleasc':
        default:
            return 'ORDER BY title ASC';
    }
};

export const getProductDetail = async (database :Database, id :number) :Promise<TProduct|undefined> => {
    const sql = 'SELECT id, title, description, date, categories, available, is_featured, primary_image_id from products WHERE id = ?';
    return await database.get(sql, id);
};

export const getProducts = async (database :Database, searchName :string, filter :string, limit :number = 10, from :number = 0, includePrimaryImage = false) :Promise<TProduct[]> => {
    // this implementation is better performant than using offset
    let searchNameSql = searchName ? "title LIKE '%" + searchName + "%' AND " : '';
    const filterSql = getFilterSql(filter);
    let sql = "select p.id, title, description, date, categories, available, is_featured, primary_image_id ";
    if (includePrimaryImage)
        sql += ",image_url as primary_image_url ";
    sql += "from products as p "; 
    if (includePrimaryImage) {
        sql += " LEFT JOIN product_images AS pi ON pi.id = p.primary_image_id "
    }
    sql += `where ${searchNameSql}p.oid not in ( select oid from products order by id asc limit ${from}) ${filterSql} limit ${limit}`;
    return await database.all(sql);
};

export const getFeaturedProducts = async (database :Database, includePrimaryImage = false) :Promise<TProduct[]> => {
    let sql = "select p.id, title, description, date, categories, available, is_featured, primary_image_id "
    if (includePrimaryImage)
        sql += ",image_url as primary_image_url ";
    sql += "from products as p ";
    if (includePrimaryImage)
        sql += "LEFT JOIN product_images AS pi ON pi.id = p.primary_image_id ";
    sql += "WHERE p.is_featured = true ";
    return await database.all(sql);
};

export const getProductsCount = async (database :Database, searchName :string, filter :string) :Promise<number> => {
    const filterSql = getFilterSql(filter);
    let sql = `select count(oid) as count from products${searchName ? " where title LIKE '%" + searchName + "%'" : ' where 1=1'} ${filterSql};`;
    return (await database.get(sql)).count || 0;
};

export const newProduct = async (database :Database, product :TProduct) :Promise<number> => {
    const sql = "INSERT INTO products(title, description, date, categories, available, is_featured, primary_image_id) VALUES(?,?,?,?,?,?,?);"
    await database.run(sql, product.title, product.description, product.date, product.categories, product.available, product.is_featured, product.primary_image_id);
    const newProductId = await database.get("SELECT last_insert_rowid() as id;");
    return newProductId.id;
};

export const updateProduct = async (database :Database, id :number, fields :any) => {
    const updateSql :string[] = [];
    const productInterface = ["title", "description", "date", "categories", "available", "is_featured", "primary_image_id"];
    productInterface.forEach(f => {
        if (typeof fields[f] != 'undefined') {
            switch (typeof fields[f]){
                case 'number':
                case 'boolean': 
                    updateSql.push(f + ' = ' + fields[f]);
                    break;
                case 'string':
                    updateSql.push(f + ' = "' + fields[f] + '"');
                    break;
            }
        }
    });
    if (updateSql.length == 0)
        throw("Empty fields body, cannot update" + id);
    let sql = `UPDATE products SET ${updateSql.join(',')} WHERE id = ?;`;
    return await database.run(sql, id);
};

export const deleteProduct = async (database :Database, id :number) => {
    const sql = 'DELETE FROM products WHERE id = ?;';
    return await database.run(sql, id);
};

export interface TProductImage {
    id :number,
    product_id :number,
    image_url :string
};

export const getProductImage = async (database :Database, id :number) :Promise<TProductImage | undefined> => {
    const sql = 'SELECT id, product_id, image_url FROM product_images WHERE id = ?;';
    return await database.get(sql, id);
};

export const getProductImages = async (database :Database, id :number) :Promise<TProductImage[]> => {
    const sql = 'SELECT id, image_url FROM product_images WHERE product_id = ?;';
    return await database.all(sql, id);
};

export const getProductImagesCount = async (database :Database, id :number) :Promise<number> => {
    const sql = 'SELECT count(oid) as count FROM product_images WHERE product_id = ?;';
    return (await database.get(sql, id)).count || 0;
};

export const newProductImage = async (database :Database, productId :number, imageUrl :string) :Promise<TProductImage> => {
    const sql = 'INSERT INTO product_images(product_id, image_url) VALUES (?,?);';
    await database.run(sql, productId, imageUrl);
    const newImageId = await database.get("SELECT last_insert_rowid() as id;");
    return {
        id: newImageId.id,
        product_id: productId,
        image_url: imageUrl
    };
};

export const setProductPrimaryImage = async (database :Database, productId :number, imageId :number) => {
    const sql = 'UPDATE products SET primary_image_id = ? WHERE id = ?;';
    return await database.run(sql, imageId, productId);
}

export const deleteProductImage = async (database :Database, id :number) => {
    const sql = 'DELETE FROM product_images WHERE id = ?;';
    return await database.run(sql, id);
};

export interface TCategory {
    id :number,
    name :string
};

export const getCategories = async (database :Database) :Promise<TCategory[]> => {
    const sql = 'SELECT id, name FROM categories;';
    return await database.all(sql);
};

export const newCategories = async (database :Database, categories :TCategory[]) => {
    if (categories.length > 0) {
        let sql = "INSERT INTO categories(name) VALUES ";
        categories.forEach((cat, index) => {
            if (index > 0)
                sql += ",";
            sql += `("${cat.name}")`;
        });
        return await database.run(sql);
    }
};

export const updateCategory = async (database :Database, category :TCategory) => {
    const sql = "UPDATE categories SET name = ? WHERE id = ?;"
    return await database.run(sql, category.name, category.id);
};

export const deleteCategory = async (database :Database, id :number) => {
    const sql = "DELETE FROM categories WHERE id = ?";
    return await database.run(sql, id);
};